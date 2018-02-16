import { GraphQLServer } from 'graphql-yoga';
import resolvers from './resolvers';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => {
  // eslint-disable-next-line
  console.log(`The server is running on http://localhost:4000`);
});
