const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// Start quiz attempt
exports.startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // Check if user already has an in-progress attempt
    const existingAttempt = await Attempt.findOne({
      userId: req.user.id,
      quizId,
      status: 'in-progress'
    });
    
    if (existingAttempt) {
      return res.json({
        success: true,
        message: 'Resuming existing attempt',
        data: existingAttempt
      });
    }
    
    const attempt = new Attempt({
      userId: req.user.id,
      quizId,
      startTime: new Date(),
      status: 'in-progress',
      answers: [],
      earnedPoints: 0,
      score: 0,
      percentageScore: 0
    });
    
    await attempt.save();
    
    res.json({
      success: true,
      message: 'Quiz started successfully',
      data: attempt
    });
  } catch (error) {
    console.error('Start quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Submit answer for a question
exports.submitAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedAnswer, timeTaken } = req.body;
    
    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }
    
    // Check if user owns this attempt
    if (attempt.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    
    // Check if answer is correct
    let isCorrect = false;
    let pointsEarned = 0;
    
    if (question.type === 'mcq') {
      isCorrect = selectedAnswer === question.correctAnswer;
    } else if (question.type === 'true-false') {
      isCorrect = selectedAnswer === question.correctAnswer;
    } else if (question.type === 'multiple-select') {
      try {
        isCorrect = JSON.stringify(selectedAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());
      } catch(e) {
        isCorrect = selectedAnswer === question.correctAnswer;
      }
    }
    
    if (isCorrect) {
      pointsEarned = question.points || 10;
      question.correctCount = (question.correctCount || 0) + 1;
    } else {
      question.wrongCount = (question.wrongCount || 0) + 1;
    }
    question.timesUsed = (question.timesUsed || 0) + 1;
    await question.save();
    
    // Add answer to attempt
    attempt.answers.push({
      questionId,
      selectedAnswer,
      isCorrect,
      timeTaken: timeTaken || 0,
      pointsEarned,
      feedback: isCorrect ? (question.explanation || 'Correct!') : `Incorrect. ${question.explanation || ''}`
    });
    
    attempt.earnedPoints = (attempt.earnedPoints || 0) + pointsEarned;
    await attempt.save();
    
    res.json({
      success: true,
      message: 'Answer submitted',
      data: {
        isCorrect,
        pointsEarned,
        correctAnswer: isCorrect ? null : question.correctAnswer,
        explanation: question.explanation,
        feedback: isCorrect ? 'Correct! Well done!' : `Incorrect. The correct answer is: ${question.correctAnswer}`
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Complete quiz
exports.completeQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params;
    
    const attempt = await Attempt.findById(attemptId).populate('quizId');
    
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }
    
    if (attempt.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    attempt.endTime = new Date();
    attempt.status = 'completed';
    
    // Calculate final score
    const totalQuestions = attempt.answers.length;
    const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
    attempt.score = correctAnswers;
    attempt.percentageScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    await attempt.save();
    
    // Calculate topic mastery
    const questions = await Question.find({
      _id: { $in: attempt.answers.map(a => a.questionId) }
    });
    
    const topicMastery = {};
    for (const answer of attempt.answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId.toString());
      if (question && question.topic) {
        if (!topicMastery[question.topic]) {
          topicMastery[question.topic] = { total: 0, correct: 0 };
        }
        topicMastery[question.topic].total++;
        if (answer.isCorrect) topicMastery[question.topic].correct++;
      }
    }
    
    const masteryScores = {};
    for (const [topic, data] of Object.entries(topicMastery)) {
      masteryScores[topic] = (data.correct / data.total) * 100;
    }
    
    attempt.topicMastery = masteryScores;
    await attempt.save();
    
    res.json({
      success: true,
      message: 'Quiz completed successfully',
      data: {
        score: attempt.score,
        percentageScore: attempt.percentageScore,
        totalQuestions,
        correctAnswers,
        topicMastery: masteryScores,
        passed: attempt.quizId ? attempt.percentageScore >= (attempt.quizId.passingScore || 50) : false,
        earnedPoints: attempt.earnedPoints
      }
    });
  } catch (error) {
    console.error('Complete quiz error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Get quiz results
exports.getQuizResults = async (req, res) => {
  try {
    const { attemptId } = req.params;
    
    const attempt = await Attempt.findById(attemptId)
      .populate('quizId')
      .populate('answers.questionId');
    
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }
    
    // Check if user owns this attempt or is admin/teacher
    if (attempt.userId.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const totalQuestions = attempt.answers.length;
    const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
    
    // Prepare detailed results
    const detailedResults = attempt.answers.map(answer => ({
      questionId: answer.questionId?._id,
      questionText: answer.questionId?.text || 'Question not found',
      userAnswer: answer.selectedAnswer,
      correctAnswer: answer.questionId?.correctAnswer,
      isCorrect: answer.isCorrect,
      explanation: answer.questionId?.explanation,
      timeTaken: answer.timeTaken,
      pointsEarned: answer.pointsEarned
    }));
    
    res.json({
      success: true,
      data: {
        quizTitle: attempt.quizId?.title || 'Quiz',
        score: attempt.score,
        totalQuestions,
        correctAnswers,
        percentageScore: attempt.percentageScore,
        passed: attempt.quizId ? attempt.percentageScore >= (attempt.quizId.passingScore || 50) : false,
        earnedPoints: attempt.earnedPoints,
        startTime: attempt.startTime,
        endTime: attempt.endTime,
        duration: attempt.endTime ? (attempt.endTime - attempt.startTime) / 1000 / 60 : 0,
        topicMastery: attempt.topicMastery,
        detailedResults
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Get user's quiz attempts
exports.getUserAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .populate('quizId', 'title difficulty type')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      data: attempts
    });
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};