import { mergeResolvers } from "@graphql-tools/merge";
import pokemonTypes from "./services/pokeApi/types/types.resolvers";
import pokemon from "./services/pokeApi/pokemon/pokemon.resolvers";
import natures from "./services/pokeApi/natures/natures.resolvers";

const resolvers = [pokemonTypes, pokemon, natures];

export default mergeResolvers(resolvers);
