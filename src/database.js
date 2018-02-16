const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.dbUri);
// mongoose.Promise = global.Promise;

export const Posts = mongoose.model('Posts', {
  title: String,
  content: String,
  published: Boolean,
});
