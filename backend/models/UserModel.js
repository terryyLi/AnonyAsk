const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [postSchema],
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
