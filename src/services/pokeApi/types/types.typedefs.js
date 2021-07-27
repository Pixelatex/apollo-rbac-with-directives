const { gql } = require("apollo-server");
// The GraphQL schema
const schema = gql`
  type pokemonType {
    url: String!
    name: String!
  }

  extend type Query {
    types: [pokemonType] @auth(requires: [ADMIN])
  }
`;

export default schema;
