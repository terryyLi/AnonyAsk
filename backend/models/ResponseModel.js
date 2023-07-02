const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const ResponseModel = mongoose.model('Response', responseSchema);

module.exports = ResponseModel;
