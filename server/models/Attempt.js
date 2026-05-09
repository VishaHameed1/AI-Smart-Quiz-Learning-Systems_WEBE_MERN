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
    enum: ['in-progress', 'completed', 'abandoned'],
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
    const totalQuestions = this.answers.length;
    const correctAnswers = this.answers.filter(a => a.isCorrect).length;
    this.score = correctAnswers;
    this.percentageScore = (correctAnswers / totalQuestions) * 100;
    
    // Calculate points
    this.totalPoints = this.answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  }
  next();
});

module.exports = mongoose.model('Attempt', attemptSchema);