const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

// Elo rating system for questions
const K_FACTOR = 32;

function calculateNewEloRating(userElo, questionElo, isCorrect) {
  const expectedScore = 1 / (1 + Math.pow(10, (questionElo - userElo) / 400));
  const actualScore = isCorrect ? 1 : 0;
  const newUserElo = userElo + K_FACTOR * (actualScore - expectedScore);
  const newQuestionElo = questionElo + K_FACTOR * (expectedScore - actualScore);
  return { newUserElo, newQuestionElo };
}

// Get next question based on adaptive difficulty
exports.getNextQuestion = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { lastQuestionId, wasCorrect, timeTaken } = req.body;
    
    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }
    
    // Get user's performance data
    const userPreviousAttempts = await Attempt.find({
      userId: attempt.userId,
      status: 'completed'
    }).populate('answers.questionId');
    
    // Calculate user's current skill level
    let userSkillLevel = 1200; // Default Elo rating
    
    for (const prevAttempt of userPreviousAttempts) {
      for (const answer of prevAttempt.answers) {
        if (answer.questionId) {
          const { newUserElo } = calculateNewEloRating(
            userSkillLevel,
            answer.questionId.eloRating,
            answer.isCorrect
          );
          userSkillLevel = newUserElo;
        }
      }
    }
    
    // Update based on last question
    if (lastQuestionId) {
      const lastQuestion = await Question.findById(lastQuestionId);
      if (lastQuestion) {
        const { newUserElo } = calculateNewEloRating(
          userSkillLevel,
          lastQuestion.eloRating,
          wasCorrect
        );
        userSkillLevel = newUserElo;
      }
    }
    
    // Determine next difficulty based on user skill level
    let nextDifficulty;
    if (userSkillLevel < 1000) nextDifficulty = 'easy';
    else if (userSkillLevel < 1300) nextDifficulty = 'medium';
    else if (userSkillLevel < 1600) nextDifficulty = 'hard';
    else nextDifficulty = 'expert';
    
    // Get questions already answered in this attempt
    const answeredQuestionIds = attempt.answers.map(a => a.questionId);
    
    // Find next question
    const nextQuestion = await Question.findOne({
      _id: { $nin: answeredQuestionIds },
      difficulty: nextDifficulty
    }).select('-correctAnswer');
    
    if (!nextQuestion) {
      // If no question of that difficulty, get any unanswered question
      const fallbackQuestion = await Question.findOne({
        _id: { $nin: answeredQuestionIds }
      }).select('-correctAnswer');
      
      return res.json({
        success: true,
        data: fallbackQuestion,
        adaptiveInfo: {
          userSkillLevel,
          nextDifficulty: 'any',
          message: 'No questions of target difficulty found'
        }
      });
    }
    
    // Record adaptive history
    attempt.adaptiveHistory.push({
      questionId: nextQuestion._id,
      difficultyAtTime: nextDifficulty,
      timestamp: new Date()
    });
    await attempt.save();
    
    res.json({
      success: true,
      data: nextQuestion,
      adaptiveInfo: {
        userSkillLevel: Math.round(userSkillLevel),
        nextDifficulty,
        questionsRemaining: await Question.countDocuments({
          _id: { $nin: answeredQuestionIds }
        })
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user's skill level
exports.getUserSkillLevel = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const attempts = await Attempt.find({
      userId,
      status: 'completed'
    }).populate('answers.questionId');
    
    let userSkillLevel = 1200;
    
    for (const attempt of attempts) {
      for (const answer of attempt.answers) {
        if (answer.questionId) {
          const { newUserElo } = calculateNewEloRating(
            userSkillLevel,
            answer.questionId.eloRating,
            answer.isCorrect
          );
          userSkillLevel = newUserElo;
        }
      }
    }
    
    let skillLevelText;
    if (userSkillLevel < 1000) skillLevelText = 'Beginner';
    else if (userSkillLevel < 1300) skillLevelText = 'Intermediate';
    else if (userSkillLevel < 1600) skillLevelText = 'Advanced';
    else skillLevelText = 'Expert';
    
    res.json({
      success: true,
      data: {
        eloRating: Math.round(userSkillLevel),
        skillLevel: skillLevelText,
        recommendedDifficulty: userSkillLevel < 1000 ? 'easy' : 
                              userSkillLevel < 1300 ? 'medium' : 
                              userSkillLevel < 1600 ? 'hard' : 'expert'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update question difficulty based on performance
exports.updateQuestionDifficulty = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    
    const correctRate = question.correctRate;
    let newDifficulty = question.difficulty;
    
    // Adjust difficulty based on success rate
    if (correctRate > 80 && question.difficulty !== 'expert') {
      if (question.difficulty === 'easy') newDifficulty = 'medium';
      else if (question.difficulty === 'medium') newDifficulty = 'hard';
      else if (question.difficulty === 'hard') newDifficulty = 'expert';
    } else if (correctRate < 30 && question.difficulty !== 'easy') {
      if (question.difficulty === 'expert') newDifficulty = 'hard';
      else if (question.difficulty === 'hard') newDifficulty = 'medium';
      else if (question.difficulty === 'medium') newDifficulty = 'easy';
    }
    
    if (newDifficulty !== question.difficulty) {
      question.difficulty = newDifficulty;
      await question.save();
    }
    
    res.json({
      success: true,
      message: `Difficulty updated to ${newDifficulty}`,
      data: {
        difficulty: newDifficulty,
        correctRate,
        timesUsed: question.timesUsed
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};