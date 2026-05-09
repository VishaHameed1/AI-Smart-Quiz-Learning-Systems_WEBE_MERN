 const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  level: {
    type: Number,
    default: 1
  },
  totalXp: {
    type: Number,
    default: 0
  },
  xpToNextLevel: {
    type: Number,
    default: 100
  },
  currentLevelXp: {
    type: Number,
    default: 0
  },
  xpHistory: [{
    amount: Number,
    source: String,
    referenceId: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now }
  }],
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: Date,
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    }
  }],
  dailyGoal: {
    target: { type: Number, default: 30 },
    current: { type: Number, default: 0 },
    lastReset: Date,
    streak: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gamification', gamificationSchema);
