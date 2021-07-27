import { defaultFieldResolver } from "graphql"
import { SchemaDirectiveVisitor } from 'graphql-tools';

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRoles = this.args.requires;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        const requiredRoles =
          field._requiredAuthRoles || objectType._requiredAuthRoles;
        if (!requiredRoles) {
          return resolve.apply(this, args);
        }

        const context = args[2];
        const { user } = context
        if(user) {
            if (requiredRoles.includes(user.role)) {
                return resolve.apply(this, args);
            } else {
                throw new Error("user lacks permission for this action");
            }
        } else {
            throw new Error("no user found");
        }
       
      };
    });
  }
}

export default AuthDirective;
