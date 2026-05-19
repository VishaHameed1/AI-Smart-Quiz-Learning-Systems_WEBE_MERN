const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Question text is required']
  },
  type: {
    type: String,
    enum: ['mcq', 'multiple-select', 'true-false', 'fill-blanks', 'matching', 'code'],
    default: 'mcq'
  },
  options: [String],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  topic: {
    type: String,
  },
  subtopic: String,
  tags: [String],
  aiGenerated: {
    type: Boolean,
    default: false
  },
  sourceText: String,
  imageUrl: String,
  codeSnippet: String,
  timeLimit: {
    type: Number, // seconds per question
    default: 60
  },
  points: {
    type: Number,
    default: 10
  },
  // For adaptive algorithm
  eloRating: {
    type: Number,
    default: 1200
  },
  timesUsed: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  wrongCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for correct rate
questionSchema.virtual('correctRate').get(function() {
  if (this.timesUsed === 0) return 0;
  return (this.correctCount / this.timesUsed) * 100;
});

module.exports = mongoose.model('Question', questionSchema);