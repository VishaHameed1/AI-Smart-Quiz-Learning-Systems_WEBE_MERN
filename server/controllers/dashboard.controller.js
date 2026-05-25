const Progress = require('../models/Progress.model');
const Gamification = require('../models/Gamification.model');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment.model');
const Folder = require('../models/Folder.model');

// @desc    Get student dashboard data
// @route   GET /api/dashboard/student
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get progress
    const progress = await Progress.find({ userId });
    
    // Get enrolled folders for the student
    const enrolledFolders = await Folder.find({ 
      allowedUsers: userId 
    }).populate('createdBy', 'name email').populate('quizzes', 'title type');

    // Get gamification stats
    const gamification = await Gamification.findOne({ userId });
    
    // Get recent attempts
    const allUserAttempts = await Attempt.find({ userId, status: 'completed' });
    const recentAttempts = await Attempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('quizId', 'title');
    
    // Filter available quizzes based on enrollment and folders
    const folderQuizIds = enrolledFolders.flatMap(f => f.quizzes.map(q => q._id));
    const availableQuizzes = await Quiz.find({
      $or: [ 
        { isPublished: true, isPublic: true }, 
        { _id: { $in: folderQuizIds } } 
      ]
    }).populate('createdBy', 'name');

    const quizzesWithStatus = availableQuizzes.map(quiz => {
      const attempts = allUserAttempts.filter(a => 
        a.quizId?._id?.toString() === quiz._id.toString() || 
        a.quizId?.toString() === quiz._id.toString()
      );
      
      // Logic: 1 mark = 1 minute duration
      const duration = quiz.duration || (quiz.totalQuestions * 2);

      return {
        ...quiz.toObject(),
        isCompleted: quiz.type === 'competitive' && attempts.length > 0,
        canAttempt: quiz.type !== 'competitive' || attempts.length === 0,
        calculatedDuration: duration
      };
    });

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
        recentAttempts,
        enrolledFolders,
        quizzes: quizzesWithStatus
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
    const teacherId = req.user._id;

    // 1. Get quizzes created by this teacher
    const teacherQuizzes = await Quiz.find({ createdBy: teacherId }).select('_id');
    const teacherQuizIds = teacherQuizzes.map(quiz => quiz._id);

    // 2. Get attempts for these quizzes
    const teacherAttempts = await Attempt.find({ quizId: { $in: teacherQuizIds } }).populate('userId', 'name');

    // 3. Calculate average score for these attempts
    const avgScore = teacherAttempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / (teacherAttempts.length || 1);

    // 4. Get unique students who attempted these quizzes
    const studentIds = [...new Set(teacherAttempts.filter(a => a.userId).map(attempt => attempt.userId._id.toString()))];
    const totalStudentsAttempted = studentIds.length;

    // 5. Count active students (who made an attempt in the last 7 days on *this teacher's quizzes*)
    const activeStudentsAttempted = [...new Set(
      teacherAttempts
        .filter(attempt => attempt.userId && attempt.createdAt > new Date(Date.now() - 7 * 86400000))
        .map(attempt => attempt.userId._id.toString())
    )].length;

    // 6. Get pending enrollment requests count
    const pendingEnrollmentsCount = await Enrollment.countDocuments({
      quiz: { $in: teacherQuizIds },
      status: 'pending'
    });

    res.json({
      success: true,
      data: {
        totalQuizzesCreated: teacherQuizzes.length,
        totalAttemptsOnMyQuizzes: teacherAttempts.length,
        averageScoreOnMyQuizzes: avgScore.toFixed(2),
        totalStudentsWhoAttemptedMyQuizzes: totalStudentsAttempted,
        activeStudentsOnMyQuizzes: activeStudentsAttempted,
        pendingEnrollmentsCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/dashboard/admin
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalAttempts = await Attempt.countDocuments();
    
    // Get folders and quizzes with creator details for the dashboard
    const folders = await Folder.find().populate('createdBy', 'name email');
    const quizzes = await Quiz.find().populate('createdBy', 'name email');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuizzes,
        totalAttempts,
        folders,
        quizzes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudentDashboard, getTeacherDashboard, getAdminDashboard };
