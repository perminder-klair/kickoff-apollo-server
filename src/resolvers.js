const db = require('./database');

const resolvers = {
  Query: {
    posts: () => db.Posts.find(),
    post: (parent, args) => db.Posts.find({ _id: args.id }),
  },
  Mutation: {
    createDraft: (parent, args) => {
      const post = {
        title: args.title,
        content: args.content,
        published: false,
      }
      const Post = new db.Posts(post);
      return Post.save();
    },
    deletePost: (parent, args) => db.Posts.remove({ _id: args.id }),
    publish: (parent, args) => {
      const Post = db.Posts.find({ _id: args.id });
      Post.published = true
      return Post.save();
    }
  },
}

module.exports = resolvers;
