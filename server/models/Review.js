const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  interval: { type: Number, default: 1 }, // days
  easeFactor: { type: Number, default: 2.5 },
  repetitions: { type: Number, default: 0 },
  nextReview: { type: Date, default: Date.now },
  history: [{ quality: Number, date: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
