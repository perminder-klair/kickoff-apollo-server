import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date

  type Success {
    success: Boolean
  }

  type Query {
    hello: String
  }

  type UploadResult {
    signedUrl: String!
    fileUrl: String!
  }

  input ContactInput {
    fullName: String!
    email: String!
    subject: String
    message: String!
  }

  type Mutation {
    getSignedUploadUrl(fileKey: String!, fileType: String!): UploadResult
    contact(input: ContactInput!): Success
  }
`;

export default typeDefs;
