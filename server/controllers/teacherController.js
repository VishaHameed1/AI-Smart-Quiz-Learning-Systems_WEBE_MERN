const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

exports.getStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;
    // For simplicity, return all students (in real app, filter by class)
    const students = await User.find({ role: 'student' }).select('name email avatar lastActive');
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('GetStudents Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.id;
    const attempts = await Attempt.find({ userId: studentId }).sort({ createdAt: -1 }).limit(200).populate('quizId');
    res.json({ success: true, data: { attempts } });
  } catch (error) {
    console.error('GetStudentProgress Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', lastActive: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) } });
    const attempts = await Attempt.find().sort({ createdAt: -1 }).limit(100);
    const avgScore = attempts.length ? (attempts.reduce((s,a)=>s+(a.percentageScore||0),0)/attempts.length) : 0;
    res.json({ success: true, data: { totalStudents, activeStudents, avgScore } });
  } catch (error) {
    console.error('GetAnalytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getClassReport = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalQuizzes = await Quiz.countDocuments({ createdBy: req.user.id });
    const attempts = await Attempt.find().populate('quizId').sort({ createdAt: -1 }).limit(100);
    const averageScore = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / attempts.length) : 0;
    const passCount = attempts.filter(a => a.percentageScore >= (a.quizId?.passingScore || 0)).length;
    const passRate = attempts.length ? Math.round((passCount / attempts.length) * 100) : 0;
    const recentActivity = {
      last7Days: attempts.filter(a => a.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      last30Days: attempts.filter(a => a.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    };

    const report = `Class Report Summary:\n
Total students: ${totalStudents}\nTotal quizzes created: ${totalQuizzes}\nAverage score across recent attempts: ${averageScore}%\nPass rate: ${passRate}%\nRecent activity: ${recentActivity.last7Days} attempts in the last 7 days, ${recentActivity.last30Days} attempts in the last 30 days.`;

    res.json({ success: true, data: { report } });
  } catch (error) {
    console.error('GetClassReport Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user.id };
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: quizzes });
  } catch (error) {
    console.error('GetQuizzes Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
