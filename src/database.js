const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.dbUri);

const Posts = mongoose.model('Posts', {
  title: String,
  content: String,
  published: Boolean
});

module.exports = { Posts };