const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

// schema parts
const resolvers = require("./resolvers.js");
const typeDefs = require("./typedefs.js");

// datasources
const pokemonDatasource = require("./datasources/pokemon.js");

// directives
const authDirective = require("./directives/authDirective.js");

const { authDirectiveTransformer, authDirectiveTypeDefs } = authDirective();

async function startServer() {
  // Add directive typedefs to the schema
  let schema = makeExecutableSchema({
    typeDefs: [...typeDefs, authDirectiveTypeDefs],
    resolvers,
  });

  // Apply directives
  schema = authDirectiveTransformer(schema);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: async ({ req }) => {
      let user = null;
      const token = req.headers["authentication"];
      if (token) {
        // get the user for your token
        // add an actual async call to whatever authentication logic you use
        // Set the token to be what role you need for testing this example E.G. ADMIN, EDITOR, ..
        user = {
          role: token,
          name: "example user",
        };
      }
      return {
        user,
      };
    },
    dataSources: () => ({
      pokemonDatasource: new pokemonDatasource(),
    }),
    playground: process.NODE_ENV !== "production",
    introspection: true,
  });
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  app.use("*", cors());
  await server.start();
  server.applyMiddleware({ app, path: "/" });

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
}

startServer();
