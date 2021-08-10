const { RESTDataSource } = require("apollo-datasource-rest");

class PokemonDatasource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://pokeapi.co/api/v2/";
  }

  async getAll(key) {
    const response = await this.get(key, null);
    return response || [];
  }
}

module.exports = PokemonDatasource;
