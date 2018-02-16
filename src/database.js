import mongoose from 'mongoose';
import config from './config';

mongoose.connect(config.dbUri);
mongoose.Promise = global.Promise;

export const Posts = mongoose.model('Posts', {
  title: String,
  content: String,
  published: { type: Boolean, default: false },
});
