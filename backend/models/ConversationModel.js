const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
  },
});

const ConversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = ConversationModel;
