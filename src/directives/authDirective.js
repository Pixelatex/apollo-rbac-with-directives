const { defaultFieldResolver } = require("graphql");
const { mapSchema, getDirective, MapperKind } = require("@graphql-tools/utils");

const directiveName = "auth";

function authDirective() {
  const typeDirectiveArgumentMaps = {};
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(
      requires: [Role] = [],
    ) on OBJECT | FIELD_DEFINITION

    enum Role {
      ADMIN
      EDITOR
    }`,
    authDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(schema, type, directiveName)?.[0];
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          let authDirective = getDirective(schema, fieldConfig, directiveName);
          authDirective = authDirective
            ? authDirective[0]
            : typeDirectiveArgumentMaps[typeName];
          if (authDirective) {
            const { requires } = authDirective;
            if (requires) {
              const { resolve = defaultFieldResolver } = fieldConfig;
              fieldConfig.resolve = function (source, args, context, info) {
                const { user } = context;
                if (user) {
                  if (requires.includes(user.role)) {
                    return resolve(source, args, context, info);
                  } else {
                    throw new Error("user lacks permission for this action");
                  }
                } else {
                  throw new Error("no user found");
                }
              };
              return fieldConfig;
            }
          }
        },
      }),
  };
}
module.exports = authDirective;
