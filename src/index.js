import {
ApolloServer,
} from "apollo-server-express"
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from "express"
import cors from "cors"
import {
    ApolloServerPluginLandingPageGraphQLPlayground
  } from "apollo-server-core";

// schema parts
import typeDefs from "./typedefs"
import resolvers from "./resolvers"

// datasources
import pokemonDatasource from './datasources/pokemon'

// directives
import authDirective from './directives/authDirective'


async function startServer() {
    const schemaDirectives = {
        auth: authDirective,
      };
      
      const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
        schemaDirectives,
      });
    
    
    
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
          ],
        context: async ({ req }) => {
          let user = null;
          const token = req.headers["authentication"];
          if (token) {
            // get the user for your token
            // add an actual async call to whatever authentication logic you use
            // Set the token to be what role you need for testing this example E.G. ADMIN, EDITOR, ..
            user = {
                role: token,
                name: 'example user'
            }
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

startServer()

