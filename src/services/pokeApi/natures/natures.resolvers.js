const resolvers = {
  Query: {
    natures: async (_, __, { dataSources }) => {
      const res = await dataSources.pokemonDatasource.getAll("nature");
      return res.results;
    },
  },
};

export default resolvers;
