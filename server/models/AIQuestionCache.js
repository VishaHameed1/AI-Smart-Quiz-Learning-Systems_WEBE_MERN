const mongoose = require('mongoose');

const aiQuestionCacheSchema = new mongoose.Schema({
  sourceText: {
    type: String,
    required: true,
    unique: true
  },
  generatedQuestions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    difficulty: String,
    topic: String
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours cache
  }
});

module.exports = mongoose.model('AIQuestionCache', aiQuestionCacheSchema);