const { gql } = require("apollo-server");
// The GraphQL schema
const schema = gql`
  type pokemon {
    url: String!
    name: String!
  }

  extend type Query {
    pokemon: [pokemon] @auth(requires: [EDITOR, ADMIN])
  }
`;

export default schema;
