import gql from 'graphql-tag';

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    slug: String!
    body: String!
    createdAt: Date
  }

  type Query {
    allPosts: [Post] @cacheControl(maxAge: 30)
    singlePost(slug: String!): Post @cacheControl(maxAge: 30)
  }
`;

export default typeDefs;
