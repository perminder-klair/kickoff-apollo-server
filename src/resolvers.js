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
    deletePost: (parent, args) => Posts.remove({ _id: args.id }),
    publish: async (parent, args) => {
      console.log('publish');
      try {
        const Post = await Posts.find({ _id: args.id }).exec();
        console.log('post', Post);
        Post.published = true;
        return Post.save();
      } catch (err) {
        return 'error occured';
      }
    },
  },
};

export default resolvers;
