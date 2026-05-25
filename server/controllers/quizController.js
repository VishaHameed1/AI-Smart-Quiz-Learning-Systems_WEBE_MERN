const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const Folder = require('../models/Folder.model');
const Enrollment = require('../models/Enrollment.model');

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
    
    // Base query: only published quizzes
    let query = { isPublished: true };

    // Teachers/Admins can see their own unpublished content
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
      query = { $or: [{ isPublished: true }, { createdBy: req.user._id }] };
    }
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: 'i' };
    
    let quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Aggregate access flags for students
    if (req.user && req.user.role === 'student') {
      const quizIds = quizzes.map(q => q._id);

      const [userAttempts, userEnrollments] = await Promise.all([
        Attempt.find({ userId: req.user._id, quizId: { $in: quizIds }, status: 'completed' }).select('quizId'),
        Enrollment.find({ student: req.user._id, quiz: { $in: quizIds } }).select('quiz status')
      ]);

      const attemptedQuizIds = new Set(userAttempts.map(a => a.quizId.toString()));
      const enrollMap = {};
      userEnrollments.forEach(e => { enrollMap[e.quiz.toString()] = e.status; });

      quizzes = quizzes.map(quiz => {
        const qId = quiz._id.toString();
        const status = enrollMap[qId] || 'none';
        const quizObj = quiz.toObject();
        
        return {
          ...quizObj,
          isCompleted: attemptedQuizIds.has(qId),
          enrollmentStatus: status,
          isPending: status === 'pending',
          // Access rule: either it's public/no-enrollment OR student is accepted
          hasAccess: quizObj.requiresEnrollment === false || quizObj.isPublic === true || status === 'accepted'
        };
      });
    }
    
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

// @desc    Request access to a quiz
// @route   POST /api/quizzes/:id/request-access
exports.requestAccess = async (req, res) => {
  try {
    const studentId = req.user._id;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const existing = await Enrollment.findOne({ student: studentId, quiz: quizId });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: `Already requested: Status is ${existing.status}` 
      });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      quiz: quizId,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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