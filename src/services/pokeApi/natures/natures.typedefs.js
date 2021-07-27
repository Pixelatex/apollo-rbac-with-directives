const { gql } = require("apollo-server");
// The GraphQL schema
const schema = gql`
  type nature {
    url: String!
    name: String!
  }

  extend type Query {
    natures: [nature] @auth(requires: [EDITOR])
  }
`;

export default schema;
