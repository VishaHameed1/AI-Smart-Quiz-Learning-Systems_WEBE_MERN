const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

class QuizService {
  // Get quiz with questions
  static async getQuizWithQuestions(quizId, includeAnswers = false) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return null;
    
    let query = Question.find({ quizId });
    if (!includeAnswers) {
      query = query.select('-correctAnswer');
    }
    
    const questions = await query;
    return { quiz, questions };
  }
  
  // Calculate quiz statistics
  static async getQuizStats(quizId) {
    const totalAttempts = await Attempt.countDocuments({ quizId });
    const averageScore = await Attempt.aggregate([
      { $match: { quizId: mongoose.Types.ObjectId(quizId) } },
      { $group: { _id: null, avgScore: { $avg: '$percentageScore' } } }
    ]);
    
    const completionRate = await Attempt.countDocuments({ 
      quizId, 
      status: 'completed' 
    }) / totalAttempts * 100;
    
    return {
      totalAttempts,
      averageScore: averageScore[0]?.avgScore || 0,
      completionRate: completionRate || 0,
    };
  }
  
  // Get popular quizzes
  static async getPopularQuizzes(limit = 10) {
    return await Attempt.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$quizId', attempts: { $sum: 1 } } },
      { $sort: { attempts: -1 } },
      { $limit: limit },
      { $lookup: { from: 'quizzes', localField: '_id', foreignField: '_id', as: 'quiz' } },
      { $unwind: '$quiz' }
    ]);
  }
}

module.exports = QuizService;