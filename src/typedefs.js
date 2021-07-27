import { gql } from "apollo-server";

import directives from "./utils/directives.typedefs";
import pokemonTypes from "./services/pokeApi/types/types.typedefs";
import pokemon from "./services/pokeApi/pokemon/pokemon.typedefs";
import natures from "./services/pokeApi/natures/natures.typedefs";

const root = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

const typedefsArray = [root, directives, pokemonTypes, pokemon, natures];

export default typedefsArray;
