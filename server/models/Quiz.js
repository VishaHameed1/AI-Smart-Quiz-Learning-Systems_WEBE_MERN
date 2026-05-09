const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['timed', 'practice', 'adaptive', 'competitive'],
    default: 'practice'
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  passingScore: {
    type: Number,
    default: 60 // percentage
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  totalQuestions: {
    type: Number,
    default: 10
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  attemptsAllowed: {
    type: Number,
    default: 1
  },
  instructions: String,
  thumbnail: String,
  category: String,
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for questions
quizSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'quizId'
});

module.exports = mongoose.model('Quiz', quizSchema);