import { gql } from 'apollo-server';

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    slug: String!
    body: String!
    createdAt: Date
  }

  type Query {
    allPosts: [Post]
    singlePost(slug: String!): Post
  }
`;

export default typeDefs;
