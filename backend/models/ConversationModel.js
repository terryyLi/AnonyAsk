const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  response: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Response',
  },
});

const conversationSchema = new mongoose.Schema({
  question: responseSchema,
  answer: responseSchema,
});

const ConversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = ConversationModel;
