const mongoose = require('mongoose');

const ReviewQueueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  easeFactor: {
    type: Number,
    default: 2.5,
  },
  interval: {
    type: Number,
    default: 0,
  },
  repetitions: {
    type: Number,
    default: 0,
  },
  nextReviewDate: {
    type: Date,
    required: true,
  },
  lastReviewed: Date,
  lastQuality: {
    type: Number,
    min: 0, // Corrected min value
    max: 5, // Corrected max value
  }
}, {
  timestamps: true
});

// Index for efficient queries
ReviewQueueSchema.index({ userId: 1, nextReviewDate: 1 });

module.exports = mongoose.model('ReviewQueue', ReviewQueueSchema);
