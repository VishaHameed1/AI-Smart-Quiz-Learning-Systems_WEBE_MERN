const Folder = require('../models/Folder.model');
const Attempt = require('../models/Attempt');
const Enrollment = require('../models/Enrollment.model');
const sendEmail = require('../utils/emailService');

// @desc    Get all folders assigned to the current student
// @route   GET /api/student/folders (moved from server/routes to server/controllers)
const getMyFolders = async (req, res) => {
  try {
    const studentId = req.user._id;
    // Show folders where student is allowed OR any folder to allow discovery/requests
    const folders = await Folder.find() 
      .populate('createdBy', 'name email')
      .populate({
        path: 'quizzes',
        select: 'title description duration difficulty type totalQuestions requiresEnrollment'
      });

    // Fetch completed attempts to calculate folder progress
    const completedAttempts = await Attempt.find({ 
      userId: studentId, 
      status: 'completed' 
    }).select('quizId');
    
    const completedQuizIds = new Set(completedAttempts.map(a => a.quizId.toString()));

    const pendingEnrollments = await Enrollment.find({
      student: studentId,
      status: 'pending'
    }).select('quiz');
    const pendingEnrollmentQuizIds = new Set(pendingEnrollments.map(e => e.quiz.toString()));

    const foldersWithStats = folders.map(folder => {
      const folderObj = folder.toObject();
      folderObj.isAllowed = folder.allowedUsers.some(id => id.toString() === studentId.toString());
      const total = folder.quizzes?.length || 0;
      const completed = folder.quizzes?.filter(q => completedQuizIds.has(q._id?.toString())).length || 0;
      // Check if any quiz in the folder has a pending enrollment request
      folderObj.hasPendingRequest = folder.quizzes.some(q => pendingEnrollmentQuizIds.has(q._id.toString()));
      
      folderObj.stats = { total, completed };
      return folderObj;
    });

    res.json({ success: true, data: foldersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific folder details
// @route   GET /api/student/folders/:id (moved from server/routes to server/controllers)
const getFolderById = async (req, res) => {
  try {
    const studentId = req.user._id;
    const folder = await Folder.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('quizzes', 'title description totalQuestions type difficulty requiresEnrollment points duration');

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Check if student is explicitly allowed in this folder
    const isAllowedFolder = folder.allowedUsers.some(id => id.toString() === studentId.toString());

    // Get enrollment statuses for all quizzes in this folder
    const quizIds = folder.quizzes.map(q => q._id);
    const enrollments = await Enrollment.find({ student: studentId, quiz: { $in: quizIds } });
    
    // Get completion status for competitive quiz logic
    const completedAttempts = await Attempt.find({ 
      userId: studentId, 
      quizId: { $in: quizIds }, 
      status: 'completed' 
    }).select('quizId');
    const completedQuizIds = new Set(completedAttempts.map(a => a.quizId.toString()));

    const quizzesWithStatus = folder.quizzes.map(quiz => {
      const enrollment = enrollments.find(e => e.quiz.toString() === quiz._id.toString());
      const quizObj = quiz.toObject();
      
      return {
        ...quizObj,
        enrollmentStatus: enrollment ? enrollment.status : 'none',
        isCompleted: completedQuizIds.has(quiz._id.toString()),
        isAuthorized: quizObj.isPublic || isAllowedFolder || (enrollment && enrollment.status === 'accepted')
      };
    });

    res.json({ 
      success: true, 
      data: { ...folder.toObject(), quizzes: quizzesWithStatus, isAllowedFolder } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request access to a folder
// @route   POST /api/student/folders/:folderId/request-access
const requestFolderAccess = async (req, res) => {
  try {
    const { folderId } = req.params;
    const studentId = req.user._id;

    const folder = await Folder.findById(folderId).populate('createdBy', 'name email').populate('quizzes', '_id title');
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Check if student is already allowed
    if (folder.allowedUsers.includes(studentId)) {
      return res.status(400).json({ success: false, message: 'You already have access to this folder.' });
    }

    const enrollmentPromises = [];
    const newEnrollments = [];

    for (const quiz of folder.quizzes) {
      const existingEnrollment = await Enrollment.findOne({ student: studentId, quiz: quiz._id });
      if (!existingEnrollment) {
        newEnrollments.push({
          student: studentId,
          quiz: quiz._id,
          status: 'pending'
        });
      } else if (existingEnrollment.status === 'rejected') {
        // If previously rejected, allow re-request
        existingEnrollment.status = 'pending';
        existingEnrollment.respondedAt = null;
        existingEnrollment.respondedBy = null;
        enrollmentPromises.push(existingEnrollment.save());
      }
    }

    if (newEnrollments.length > 0) {
      enrollmentPromises.push(Enrollment.insertMany(newEnrollments));
    }
    
    await Promise.all(enrollmentPromises);

    // Notify the teacher
    if (folder.createdBy && folder.createdBy.email) {
      try {
        await sendEmail({
          email: folder.createdBy.email,
          subject: 'New Folder Access Request',
          message: `Student ${req.user.name} (${req.user.email}) has requested access to your folder: "${folder.name}". This has created pending enrollment requests for all quizzes within the folder.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
              <h2 style="color: #00f2ff;">New Folder Access Request!</h2>
              <p>Hi <strong>${folder.createdBy.name}</strong>,</p>
              <p>Student <strong>${req.user.name} (${req.user.email})</strong> has requested access to your folder: <strong>"${folder.name}"</strong>.</p>
              <p>This has automatically created pending enrollment requests for all quizzes within this folder. Please review them in your dashboard.</p>
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
        console.error('Teacher notification email failed for folder request:', err);
      }
    }

    res.status(200).json({ success: true, message: 'Folder access request sent successfully.' });
  } catch (error) {
    console.error('Request folder access error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel access request to a folder
// @route   DELETE /api/student/folders/:folderId/cancel-request
const cancelFolderAccessRequest = async (req, res) => {
  try {
    const { folderId } = req.params;
    const studentId = req.user._id;

    const folder = await Folder.findById(folderId).select('quizzes');
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Remove all pending enrollments for quizzes in this folder for this student
    await Enrollment.deleteMany({
      student: studentId,
      quiz: { $in: folder.quizzes },
      status: 'pending'
    });

    res.status(200).json({ success: true, message: 'Folder access request cancelled.' });
  } catch (error) {
    console.error('Cancel folder access error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyFolders, getFolderById, requestFolderAccess, cancelFolderAccessRequest };