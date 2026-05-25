const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

// Create new quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, type, duration, passingScore, difficulty, instructions } = req.body;
    
    const quiz = new Quiz({
      title,
      description,
      type,
      duration,
      passingScore,
      difficulty,
      instructions,
      createdBy: req.user._id, // Changed from req.user.id
      totalQuestions: 0,
      isPublished: false
    });
    
    await quiz.save();
    
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, difficulty, search } = req.query;
    
    // Default: Students only see published quizzes
    let query = { isPublished: true };

    // ✅ If teacher is browsing, let them see their own unpublished quizzes too
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
      query = { $or: [{ isPublished: true }, { createdBy: req.user._id }] };
    }
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: 'i' };
    
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Quiz.countDocuments(query);
    
    res.json({
      success: true,
      data: quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get quiz by ID with questions
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    const questions = await Question.find({ quizId: quiz._id })
      .select('-correctAnswer'); // Don't send correct answers before attempt
    
    res.json({
      success: true,
      data: {
        ...quiz.toObject(),
        questions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // Check if user owns the quiz
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') { // Changed from req.user.id
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: updatedQuiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    // Check if user owns the quiz
    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') { // Changed from req.user.id
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Delete all questions associated with quiz
    await Question.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();
    
    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Duplicate quiz
exports.duplicateQuiz = async (req, res) => {
  try {
    const originalQuiz = await Quiz.findById(req.params.id);
    
    if (!originalQuiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    
    const questions = await Question.find({ quizId: originalQuiz._id });
    
    // Create new quiz
    const newQuiz = new Quiz({
      title: `${originalQuiz.title} (Copy)`,
      description: originalQuiz.description,
      type: originalQuiz.type,
      duration: originalQuiz.duration,
      passingScore: originalQuiz.passingScore,
      difficulty: originalQuiz.difficulty,
      instructions: originalQuiz.instructions,
      createdBy: req.user._id, // Changed from req.user.id
      isPublished: false
    });
    
    await newQuiz.save();
    
    // Duplicate questions
    for (const q of questions) {
      const newQuestion = new Question({
        quizId: newQuiz._id,
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic: q.topic,
        subtopic: q.subtopic,
        tags: q.tags,
        timeLimit: q.timeLimit,
        points: q.points, // Changed from req.user.id
        createdBy: req.user._id
      });
      await newQuestion.save();
    }
    
    res.json({
      success: true,
      message: 'Quiz duplicated successfully',
      data: newQuiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};