 const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  subtopic: String,
  masteryScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  masteryLevel: {
    type: String,
    enum: ['novice', 'beginner', 'developing', 'proficient', 'expert'],
    default: 'novice'
  },
  questionsAttempted: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    default: 0
  },
  accuracyRate: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,
    default: 0
  },
  lastPracticed: Date,
  xpEarned: {
    type: Number,
    default: 0
  },
  history: [{
    date: Date,
    masteryScore: Number,
    questionsAttempted: Number,
    xpGained: Number
  }],
  weakSubtopics: [{
    name: String,
    correctRate: Number,
    needsReview: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
