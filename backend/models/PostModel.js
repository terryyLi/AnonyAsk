const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  },
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  conversations: [conversationSchema],
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
