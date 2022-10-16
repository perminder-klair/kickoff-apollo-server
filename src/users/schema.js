import gql from 'graphql-tag';

const typeDefs = gql`
  enum UserStatus {
    active
    notActive
    banned
  }

  type User {
    id: ID! # "!" denotes a required field
    email: String
    status: UserStatus
  }
  type JwtUser {
    jwt: String
    user: User
  }

  input RegisterInput {
    email: String!
    password: String!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  input ForgotPasswordInput {
    email: String!
  }
  input SetNewPassword {
    token: String!
    password: String!
  }

  input UserProfileInput {
    firstName: String
    lastName: String
    bio: String
    telephone: String
  }
  input UpdateUserInput {
    email: String
    profile: UserProfileInput
  }

  # This type specifies the entry points into our API. In this case
  # there is only one - "me" - which returns a current user.
  type Query {
    me: User @cacheControl(maxAge: 30)
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    register(input: RegisterInput): JwtUser
    login(input: LoginInput): JwtUser
    updateMe(input: UpdateUserInput): User
    forgotPassword(input: ForgotPasswordInput): Success
    setNewPassword(input: SetNewPassword): Success
  }
`;

export default typeDefs;
