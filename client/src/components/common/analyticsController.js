const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

/**
 * @desc    Get average score trend for teacher's quizzes over a date range
 * @route   GET /api/teacher/analytics/performance-trend
 * @access  Private (Teacher/Admin)
 */
exports.getPerformanceTrend = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide both startDate and endDate' });
    }

    // 1. Fetch quizzes created by the logged-in teacher
    // Using req.user._id as standardized in auth.controller.js
    const teacherQuizzes = await Quiz.find({ createdBy: req.user._id }).select('_id');
    const quizIds = teacherQuizzes.map(quiz => quiz._id);

    // 2. Aggregate attempts for these quizzes
    const trendData = await Attempt.aggregate([
      {
        $match: {
          quizId: { $in: quizIds },
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          averageScore: { $avg: "$percentageScore" }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          _id: 0,
          name: "$_id",
          score: { $round: ["$averageScore", 1] }
        }
      }
    ]);

    res.json({ success: true, data: trendData });
  } catch (error) {
    console.error('Trend Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get recent quiz completion activities for teacher's quizzes
 * @route   GET /api/teacher/analytics/recent-activities
 * @access  Private (Teacher/Admin)
 */
exports.getRecentActivities = async (req, res) => {
  try {
    const teacherQuizzes = await Quiz.find({ createdBy: req.user._id }).select('_id');
    const quizIds = teacherQuizzes.map(quiz => quiz._id);

    const activities = await Attempt.find({ quizId: { $in: quizIds } })
      .populate('userId', 'name')
      .populate('quizId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    const data = activities.map(a => ({
      studentName: a.userId ? a.userId.name : 'Student',
      quizTitle: a.quizId ? a.quizId.title : 'Quiz',
      score: a.percentageScore
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};