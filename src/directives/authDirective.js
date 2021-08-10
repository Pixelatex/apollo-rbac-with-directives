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
              console.log(requires, "???");
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
// class AuthDirective extends SchemaDirectiveVisitor {
//   visitObject(type) {
//     this.validate(type);
//     type._requiredAuthRole = this.args.requires;
//   }
//   // Visitor methods for nested types like fields and arguments
//   // also receive a details object that provides information about
//   // the parent and grandparent types.
//   visitFieldDefinition(field, details) {
//     this.validate(details.objectType);
//     field._requiredAuthRoles = this.args.requires;
//   }

//   validate(objectType) {
//     // Mark the GraphQLObjectType object to avoid re-wrapping:
//     if (objectType._authFieldsWrapped) return;
//     objectType._authFieldsWrapped = true;

//     const fields = objectType.getFields();
//     Object.keys(fields).forEach((fieldName) => {
//       const field = fields[fieldName];
//       const { resolve = defaultFieldResolver } = field;
//       field.resolve = async function (...args) {
//         // Get the required Role from the field first, falling back
//         // to the objectType if no Role is required by the field:
//         const requiredRoles =
//           field._requiredAuthRoles || objectType._requiredAuthRoles;
//         if (!requiredRoles) {
//           return resolve.apply(this, args);
//         }

//         const context = args[2];
//         const { user } = context;
//         if (user) {
//           if (requiredRoles.includes(user.role)) {
//             return resolve.apply(this, args);
//           } else {
//             throw new Error("user lacks permission for this action");
//           }
//         } else {
//           throw new Error("no user found");
//         }
//       };
//     });
//   }
// }

// module.exports = AuthDirective;
