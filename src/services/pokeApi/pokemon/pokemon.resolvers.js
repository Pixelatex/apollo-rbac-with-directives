const resolvers = {
  Query: {
    pokemon: async (_, __, { dataSources }) => {
      const res = await dataSources.pokemonDatasource.getAll("pokemon");
      return res.results;
    },
  },
};

module.exports = resolvers;
