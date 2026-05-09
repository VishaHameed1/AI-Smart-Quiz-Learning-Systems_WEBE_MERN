const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

// Add question to quiz
exports.addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, type, options, correctAnswer, explanation, difficulty, topic, subtopic, tags, timeLimit, points } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // Check if user owns the quiz
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const question = new Question({
      quizId,
      text,
      type,
      options,
      correctAnswer,
      explanation,
      difficulty,
      topic,
      subtopic,
      tags,
      timeLimit,
      points,
      createdBy: req.user.id
    });
    
    await question.save();
    
    // Update quiz total questions count
    quiz.totalQuestions += 1;
    await quiz.save();
    
    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      data: question
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk upload questions
exports.bulkUploadQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { questions } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const savedQuestions = [];
    for (const q of questions) {
      const question = new Question({
        quizId,
        ...q,
        createdBy: req.user.id
      });
      await question.save();
      savedQuestions.push(question);
    }
    
    quiz.totalQuestions += questions.length;
    await quiz.save();
    
    res.json({
      success: true,
      message: `${questions.length} questions added successfully`,
      data: savedQuestions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('quizId');
    
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    
    // Check if user owns the quiz
    if (question.quizId.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Question updated successfully',
      data: updatedQuestion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('quizId');
    
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    
    // Check if user owns the quiz
    if (question.quizId.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await question.deleteOne();
    
    // Update quiz total questions count
    question.quizId.totalQuestions -= 1;
    await question.quizId.save();
    
    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get questions by topic
exports.getQuestionsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const { difficulty, limit = 20 } = req.query;
    
    const query = { topic };
    if (difficulty) query.difficulty = difficulty;
    
    const questions = await Question.find(query)
      .limit(parseInt(limit))
      .select('-correctAnswer');
    
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};