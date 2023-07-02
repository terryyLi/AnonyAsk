const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  conversations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  }],
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
