import { Posts } from './database';

const resolvers = {
  Query: {
    posts: () => Posts.find(),
    post: (parent, args) => Posts.find({ _id: args.id }),
  },
  Mutation: {
    createDraft: (parent, args) => {
      const post = {
        title: args.title,
        content: args.content,
        published: false,
      };
      const Post = new Posts(post);
      return Post.save();
    },
    deletePost: async (parent, args) => {
      await Posts.remove({ _id: args.id });
      return null;
    },
    publish: async (parent, args) => {
      try {
        const Post = await Posts.findOne({ _id: args.id }).exec();
        Post.published = true;
        return Post.save();
      } catch (err) {
        return null;
      }
    },
  },
};

export default resolvers;
