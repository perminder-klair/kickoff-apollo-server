import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs, resolvers } from './utils/graphql';
import { isAuthenticated } from './utils/auth';

require('./utils/mongoose');

const schema = makeExecutableSchema({ typeDefs, resolvers });

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: 'bounded',
  introspection: true,
  playground: true,
  context: async ({ req }) => ({
    user: await isAuthenticated(req),
  }),
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
   * */
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// The `listen` method launches a web server.
server.listen({ port: 8080 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
