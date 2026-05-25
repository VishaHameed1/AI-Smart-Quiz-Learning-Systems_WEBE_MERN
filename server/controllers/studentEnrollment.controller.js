const Enrollment = require('../models/Enrollment.model');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const sendEmail = require('../utils/emailService');

// @desc    Request enrollment in a quiz
// @route   POST /api/student/enrollments/request
const requestEnrollment = async (req, res) => {
  try {
    const { quizId } = req.body;
    const studentId = req.user._id;

    // 1. Verify quiz exists
    const quiz = await Quiz.findById(quizId).populate('createdBy', 'name email');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // 2. Check for existing enrollment record
    const existing = await Enrollment.findOne({ student: studentId, quiz: quizId });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: `You already have a ${existing.status} request for this quiz.` 
      });
    }

    // 3. Create the request
    const enrollment = await Enrollment.create({
      student: studentId,
      quiz: quizId,
      status: 'pending'
    });

    // Notify the teacher about the new request
    if (quiz.createdBy && quiz.createdBy.email) {
      try {
        await sendEmail({
          email: quiz.createdBy.email,
          subject: 'New Quiz Enrollment Request',
          message: `A student has requested to join your quiz: "${quiz.title}"`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
              <h2 style="color: #00f2ff;">New Enrollment Request!</h2>
              <p>Hi <strong>${quiz.createdBy.name}</strong>,</p>
              <p>You have received a new request to enroll in your quiz: <strong>"${quiz.title}"</strong>.</p>
              <p>Please log in to your portal to approve or reject the request.</p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/teacher/enrollment-requests" 
                   style="background-color: #00f2ff; color: #030712; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Review Enrollment Requests
                </a>
              </div>
            </div>
          `
        });
      } catch (err) {
        console.error('Teacher notification email failed:', err);
      }
    }

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current student's enrollment requests
// @route   GET /api/student/enrollments/my-requests
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('quiz', 'title description');
    
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all teachers and their requestable quizzes
// @route   GET /api/student/enrollments/teachers
const getTeachersWithQuizzes = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('name email');
    const teachersData = await Promise.all(teachers.map(async (teacher) => {
      const quizzes = await Quiz.find({ 
        createdBy: teacher._id, 
        isPublished: true
      }).select('title description difficulty type');
      
      // Get enrollment status for the current student for these quizzes
      const enrollments = await Enrollment.find({ 
        student: req.user._id,
        quiz: { $in: quizzes.map(q => q._id) }
      });

      const quizzesWithStatus = quizzes.map(quiz => {
        const enrollment = enrollments.find(e => e.quiz.toString() === quiz._id.toString());
        const quizObj = quiz.toObject();
        return {
          ...quizObj,
          enrollmentStatus: enrollment ? enrollment.status : 'none',
          // We keep this to distinguish between public and private quizzes in the UI
          requiresEnrollment: quizObj.requiresEnrollment ?? true 
        };
      });

      return {
        ...teacher.toObject(),
        quizzes: quizzesWithStatus
      };
    }));

    res.json({ success: true, data: teachersData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { requestEnrollment, getMyEnrollments, getTeachersWithQuizzes };