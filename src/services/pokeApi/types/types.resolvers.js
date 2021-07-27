
const resolvers = {
    Query: {
      types: async (_, __, { dataSources }) => {
        console.log('get by type?')
        const res = await dataSources.pokemonDatasource.getAll("type");
        return res.results
      },
    },
  };
  
export default resolvers;
  