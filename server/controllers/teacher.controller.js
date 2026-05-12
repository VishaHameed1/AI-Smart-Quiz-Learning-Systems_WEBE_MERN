const User = require('../models/User.model');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

// @desc    Get all students
// @route   GET /api/teacher/students
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student progress by ID
// @route   GET /api/teacher/students/:id/progress
const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const attempts = await Attempt.find({ userId: studentId })
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });
    
    const avgScore = attempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / (attempts.length || 1);
    
    res.json({
      success: true,
      data: {
        totalAttempts: attempts.length,
        averageScore: avgScore.toFixed(2),
        recentAttempts: attempts.slice(0, 10),
        quizHistory: attempts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get class analytics
// @route   GET /api/teacher/analytics
const getClassAnalytics = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const allAttempts = await Attempt.find().populate('userId', 'name');
    
    // Group by student
    const studentStats = students.map(student => {
      const studentAttempts = allAttempts.filter(a => a.userId?._id.toString() === student._id.toString());
      const avgScore = studentAttempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / (studentAttempts.length || 1);
      
      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        totalAttempts: studentAttempts.length,
        averageScore: avgScore.toFixed(2)
      };
    });
    
    res.json({ success: true, data: studentStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudents, getStudentProgress, getClassAnalytics }; 
