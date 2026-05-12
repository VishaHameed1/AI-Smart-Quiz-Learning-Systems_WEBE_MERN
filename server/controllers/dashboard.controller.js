const Progress = require('../models/Progress.model');
const Gamification = require('../models/Gamification.model');
const Attempt = require('../models/Attempt');

// @desc    Get student dashboard data
// @route   GET /api/dashboard/student
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get progress
    const progress = await Progress.find({ userId });
    
    // Get gamification stats
    const gamification = await Gamification.findOne({ userId });
    
    // Get recent attempts
    const recentAttempts = await Attempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('quizId', 'title');
    
    // Calculate overall mastery
    let totalMastery = 0;
    progress.forEach(p => { totalMastery += p.masteryScore; });
    const avgMastery = progress.length > 0 ? totalMastery / progress.length : 0;
    
    res.json({
      success: true,
      data: {
        avgMastery,
        totalTopics: progress.length,
        totalXP: gamification?.totalXp || 0,
        level: gamification?.level || 1,
        currentStreak: gamification?.currentStreak || 0,
        recentAttempts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get teacher dashboard data
// @route   GET /api/dashboard/teacher
const getTeacherDashboard = async (req, res) => {
  try {
    // Get all students
    const students = await User.find({ role: 'student' });
    
    // Get all attempts stats
    const allAttempts = await Attempt.find().populate('userId', 'name');
    
    const avgScore = allAttempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / (allAttempts.length || 1);
    
    res.json({
      success: true,
      data: {
        totalStudents: students.length,
        totalAttempts: allAttempts.length,
        averageScore: avgScore.toFixed(2),
        activeStudents: students.filter(s => s.lastActive > Date.now() - 7 * 86400000).length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudentDashboard, getTeacherDashboard }; 
