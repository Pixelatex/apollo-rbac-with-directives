import { gql } from "apollo-server";

const schema = gql`
  directive @auth(requires: [Role] = [UNKNOWN]) on OBJECT | FIELD_DEFINITION
  enum Role {
    ADMIN
    EDITOR
  }
`;

export default schema;
