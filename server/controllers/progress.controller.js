const Progress = require('../models/Progress.model');

// @desc    Get user progress
// @route   GET /api/progress
const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update topic progress
// @route   POST /api/progress/topic
const updateTopicProgress = async (req, res) => {
  try {
    const { topic, masteryScore, questionsAttempted, correctAnswers } = req.body;
    
    let progress = await Progress.findOne({ userId: req.user._id, topic });
    
    if (!progress) {
      progress = new Progress({ userId: req.user._id, topic });
    }
    
    progress.masteryScore = masteryScore;
    progress.questionsAttempted = questionsAttempted;
    progress.correctAnswers = correctAnswers;
    progress.lastPracticed = new Date();
    
    await progress.save();
    
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get topic mastery
// @route   GET /api/progress/mastery
const getTopicMastery = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id });
    const mastery = {};
    progress.forEach(p => {
      mastery[p.topic] = p.masteryScore;
    });
    res.json({ success: true, data: mastery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUserProgress, updateTopicProgress, getTopicMastery }; 
