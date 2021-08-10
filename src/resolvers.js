const { mergeResolvers } = require("@graphql-tools/merge");
const pokemonTypes = require("./services/pokeApi/types/types.resolvers");
const pokemon = require("./services/pokeApi/pokemon/pokemon.resolvers");
const natures = require("./services/pokeApi/natures/natures.resolvers");

const resolvers = [pokemonTypes, pokemon, natures];

module.exports = mergeResolvers(resolvers);
