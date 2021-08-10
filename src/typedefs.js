const { gql } = require("apollo-server");

// const directives= require("./utils/directives.typedefs");
const pokemonTypes = require("./services/pokeApi/types/types.typedefs");
const pokemon = require("./services/pokeApi/pokemon/pokemon.typedefs");
const natures = require("./services/pokeApi/natures/natures.typedefs");

const root = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

const typedefsArray = [root, pokemonTypes, pokemon, natures];

module.exports = typedefsArray;
