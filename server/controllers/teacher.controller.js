const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment.model'); // Assuming new model
const Folder = require('../models/Folder.model'); // Assuming new model
const sendEmail = require('../utils/emailService');

// @desc    Get all students
// @route   GET /api/teacher/students
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student progress by ID
// @route   GET /api/teacher/students/:id/progress
const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const attempts = await Attempt.find({ userId: studentId })
      .populate('quizId', 'title')
      .sort({ createdAt: -1 });
    
    const avgScore = attempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / (attempts.length || 1);
    
    res.json({
      success: true,
      data: {
        totalAttempts: attempts.length,
        averageScore: avgScore.toFixed(2),
        recentAttempts: attempts.slice(0, 10),
        quizHistory: attempts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get class analytics
// @route   GET /api/teacher/analytics
const getClassAnalytics = async (req, res) => {
  try {
    // Get IDs of quizzes created by this teacher
    const teacherQuizzes = await Quiz.find({ createdBy: req.user._id }).select('_id');
    const quizIds = teacherQuizzes.map(quiz => quiz._id);

    const students = await User.find({ role: 'student' }).select('name email');
    const teacherAttempts = await Attempt.find({ quizId: { $in: quizIds } }).populate('userId', 'name');
    
    // Group by student
    const studentStats = students.map(student => {
      const studentAttempts = teacherAttempts.filter(a => a.userId?._id.toString() === student._id.toString());
      const avgScore = studentAttempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / (studentAttempts.length || 1);
      
      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        totalAttempts: studentAttempts.length,
        averageScore: avgScore.toFixed(2)
      };
    });
    
    res.json({ success: true, data: studentStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get detailed class report
// @route   GET /api/teacher/report
const getClassReport = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalQuizzes = await Quiz.countDocuments({ createdBy: req.user._id });
    const attempts = await Attempt.find().populate('quizId').sort({ createdAt: -1 }).limit(100);
    
    const averageScore = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + (a.percentageScore || 0), 0) / attempts.length) : 0;
    
    const report = {
      totalStudents,
      totalQuizzes,
      averageScore,
      recentActivityCount: attempts.filter(a => a.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
    };

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get quizzes created by teacher
// @route   GET /api/teacher/quizzes
const getQuizzes = async (req, res) => {
  try {
    // Fixed to ensure createdBy matches the current teacher's MongoDB ObjectId
    const query = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get average score trend for teacher's quizzes over a date range
// @route   GET /api/teacher/analytics/performance-trend
const getPerformanceTrend = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide both startDate and endDate' });
    }

    const teacherQuizzes = await Quiz.find({ createdBy: req.user._id }).select('_id');
    const quizIds = teacherQuizzes.map(quiz => quiz._id);

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent quiz completion activities for teacher's quizzes
// @route   GET /api/teacher/analytics/recent-activities
const getRecentActivities = async (req, res) => {
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
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get all pending enrollment requests for teacher's quizzes
// @route   GET /api/teacher/enrollments/pending
const getPendingEnrollmentRequests = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacherQuizzes = await Quiz.find({ createdBy: teacherId }).select('_id');
    const quizIds = teacherQuizzes.map(quiz => quiz._id);

    const pendingRequests = await Enrollment.find({
      quiz: { $in: quizIds },
      status: 'pending'
    })
    .populate('student', 'name email')
    .populate('quiz', 'title');

    // Fetch all folders created by this teacher to find quiz assignments
    const folders = await Folder.find({ createdBy: teacherId });

    // Map folder names to the requests
    const requestsWithFolders = pendingRequests.map(request => {
      const requestObj = request.toObject();
      // Find if the quiz belongs to a folder
      const folder = folders.find(f => f.quizzes.some(qId => qId.toString() === request.quiz._id.toString()));
      
      return {
        ...requestObj,
        folderName: folder ? folder.name : 'No Folder'
      };
    });

    res.json({ success: true, data: requestsWithFolders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Respond to an enrollment request (accept/reject)
// @route   PUT /api/teacher/enrollments/:id/respond
const respondToEnrollmentRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const enrollmentId = req.params.id;
    const teacherId = req.user._id;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('quiz', 'title createdBy')
      .populate('student', 'name email');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment request not found' });
    }

    // Ensure the teacher is the creator of the quiz or an admin
    if (enrollment.quiz.createdBy.toString() !== teacherId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to respond to this enrollment request' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided. Must be "accepted" or "rejected".' });
    }

    enrollment.status = status;
    enrollment.respondedAt = Date.now();
    enrollment.respondedBy = teacherId;
    await enrollment.save();

    // Send email notification
    if (enrollment.student && enrollment.student.email) {
      try {
        const emailContent = status === 'accepted' ? {
          email: enrollment.student.email,
          subject: 'Quiz Enrollment Accepted',
          message: `Hi ${enrollment.student.name}, your request to join the quiz "${enrollment.quiz.title}" has been accepted!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
              <h2 style="color: #00f2ff;">Enrollment Accepted!</h2>
              <p>Hi <strong>${enrollment.student.name}</strong>,</p>
              <p>Great news! Your request to join the quiz <strong>"${enrollment.quiz.title}"</strong> has been accepted by the teacher.</p>
              <p>You can now log in to the dashboard and take the quiz.</p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/quizzes" 
                   style="background-color: #00f2ff; color: #030712; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Go to Quizzes
                </a>
              </div>
            </div>
          `
        } : {
          email: enrollment.student.email,
          subject: 'Quiz Enrollment Update',
          message: `Hi ${enrollment.student.name}, unfortunately your request to join "${enrollment.quiz.title}" was not accepted at this time.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
              <h2 style="color: #ff4444;">Enrollment Status</h2>
              <p>Hi <strong>${enrollment.student.name}</strong>,</p>
              <p>Thank you for your interest in the quiz <strong>"${enrollment.quiz.title}"</strong>.</p>
              <p>Unfortunately, your enrollment request was not accepted at this time. You can contact your teacher for more information or try enrolling in other available quizzes.</p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/quizzes" 
                   style="background-color: #64748b; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  View Available Quizzes
                </a>
              </div>
            </div>
          `
        };
        await sendEmail(emailContent);
      } catch (err) {
        console.error('Email notification failed:', err);
      }
    }

    res.json({ success: true, message: `Enrollment request ${status} successfully`, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new folder
// @route   POST /api/teacher/folders
const createFolder = async (req, res) => {
  try {
    const { name, description, quizzes, allowedUsers } = req.body;
    const newFolder = await Folder.create({
      name,
      description,
      createdBy: req.user._id,
      quizzes,
      allowedUsers,
    });
    res.status(201).json({ success: true, data: newFolder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get folders created by the teacher
// @route   GET /api/teacher/folders
const getTeacherFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ createdBy: req.user._id }).populate('quizzes', 'title');
    res.json({ success: true, data: folders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a folder
// @route   PUT /api/teacher/folders/:id
const updateFolder = async (req, res) => {
  try {
    const { name, description, quizzes, allowedUsers, addQuizId } = req.body;
    const updateFields = { name, description, quizzes, allowedUsers };

    // If addQuizId is provided, use $addToSet to add it to the quizzes array
    if (addQuizId) {
      updateFields.$addToSet = { quizzes: addQuizId };
      delete updateFields.quizzes; // Prevent overwriting if quizzes array is also sent
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { ...updateFields, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found or not authorized' });
    }
    res.json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove a student from a folder
// @route   DELETE /api/teacher/folders/:folderId/students/:studentId
const removeStudentFromFolder = async (req, res) => {
  try {
    const { folderId, studentId } = req.params;
    const folder = await Folder.findOne({ _id: folderId, createdBy: req.user._id });

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    folder.allowedUsers = folder.allowedUsers.filter(id => id.toString() !== studentId);
    await folder.save();

    // Notify student about removal
    try {
      await sendEmail({
        email: student.email,
        subject: 'Access Updated: Folder Membership',
        message: `Your access to the folder "${folder.name}" has been removed.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h3>Access Notification</h3>
            <p>Hi ${student.name},</p>
            <p>This is to inform you that your access to the content folder <strong>"${folder.name}"</strong> has been removed by the teacher.</p>
            <p>If you believe this is an error, please reach out to your instructor.</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Removal notification email failed:', emailErr);
    }

    res.json({ success: true, message: 'Student removed from folder successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Utility: Send daily summary of pending requests to all teachers
// This can be called by a cron job or admin trigger
const sendDailyEnrollmentSummary = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' });

    for (const teacher of teachers) {
      const teacherQuizzes = await Quiz.find({ createdBy: teacher._id }).select('_id');
      const quizIds = teacherQuizzes.map(q => q._id);

      const pendingCount = await Enrollment.countDocuments({
        quiz: { $in: quizIds },
        status: 'pending'
      });

      if (pendingCount > 0) {
        await sendEmail({
          email: teacher.email,
          subject: 'Daily Action Required: Pending Enrollments',
          message: `You have ${pendingCount} pending enrollment requests waiting for review.`,
          html: `
            <div style="background: #f8fafc; padding: 30px; font-family: sans-serif;">
              <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <h2 style="color: #0f172a;">Enrollment Summary</h2>
                <p>Hello ${teacher.name},</p>
                <p>You have <strong>${pendingCount}</strong> new students waiting to join your private quizzes.</p>
                <div style="margin-top: 20px;">
                  <a href="${process.env.CLIENT_URL}/teacher/enrollment-requests" 
                     style="background: #00f2ff; color: #0f172a; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                    Review Requests Now
                  </a>
                </div>
              </div>
            </div>
          `
        });
      }
    }

    if (res) res.json({ success: true, message: 'Summary emails sent to active teachers' });
  } catch (error) {
    if (res) res.status(500).json({ success: false, message: error.message });
    else console.error('Daily summary failed:', error);
  }
};

module.exports = { 
  getStudents, getStudentProgress, getClassAnalytics, getClassReport, getQuizzes, 
  getPerformanceTrend, getRecentActivities, getPendingEnrollmentRequests, 
  respondToEnrollmentRequest, createFolder, getTeacherFolders, updateFolder,
  removeStudentFromFolder, sendDailyEnrollmentSummary
};
