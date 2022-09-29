const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      index: true,
      lowercase: true,
      trim: true,
    },
    telephone: {
      type: String,
      index: true,
      minlength: 8,
      trim: true,
    },
    profile: {
      type: ProfileSchema,
    },
  },
  {
    collection: 'users_test',
    strict: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const getModel = () => {
  if (mongoose.models.User) {
    return mongoose.model('User');
  }
  return mongoose.model('User', UserSchema);
};

module.exports = getModel();
