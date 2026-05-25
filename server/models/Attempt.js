const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['correct', 'incorrect', 'pending-grade'],
      default: 'correct'
    },
    timeTaken: Number, // seconds
    pointsEarned: {
      type: Number,
      default: 0
    },
    feedback: String
  }],
  score: {
    type: Number,
    default: 0
  },
  percentageScore: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  earnedPoints: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned', 'completed-pending-review'],
    default: 'in-progress'
  },
  adaptiveHistory: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    difficultyAtTime: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  topicMastery: {
    type: Map,
    of: Number
  }
}, {
  timestamps: true
});

// Calculate score before saving
attemptSchema.pre('save', function(next) {
  if (this.answers && this.answers.length > 0) {
    // Only calculate score for answers that have been graded
    const gradedAnswers = this.answers.filter(a => a.status !== 'pending-grade');
    const correctAnswers = gradedAnswers.filter(a => a.isCorrect).length;
    
    this.score = correctAnswers;
    this.percentageScore = this.answers.length > 0 ? (correctAnswers / this.answers.length) * 100 : 0;
    
    // Track user actual score in earnedPoints
    this.earnedPoints = this.answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Attempt', attemptSchema);