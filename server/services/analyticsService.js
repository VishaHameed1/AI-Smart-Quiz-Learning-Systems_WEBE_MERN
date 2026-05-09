const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

class AnalyticsService {
  static async getQuizStats(quizId) {
    const attempts = await Attempt.find({ quizId, status: 'completed' });
    const totalAttempts = attempts.length;
    const averageScore = attempts.reduce((sum, a) => sum + a.percentageScore, 0) / totalAttempts;
    
    return {
      totalAttempts,
      averageScore: averageScore || 0,
      passRate: attempts.filter(a => a.percentageScore >= 60).length / totalAttempts * 100
    };
  }
  
  static async getUserProgress(userId) {
    const attempts = await Attempt.find({ userId, status: 'completed' }).populate('quizId');
    return attempts.map(a => ({
      quizTitle: a.quizId.title,
      score: a.percentageScore,
      date: a.createdAt
    }));
  }
}

module.exports = AnalyticsService;
