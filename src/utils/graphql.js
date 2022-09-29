import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import MainSchema from '../main/schema';
import MainResolvers from '../main/resolvers';
import UsersSchema from '../users/schema';
import UsersResolvers from '../users/resolvers';
import PostsSchema from '../posts/schema';
import PostsResolvers from '../posts/resolvers';

export const typeDefs = mergeTypeDefs([MainSchema, UsersSchema, PostsSchema]);
export const resolvers = mergeResolvers([
  MainResolvers,
  UsersResolvers,
  PostsResolvers,
]);
