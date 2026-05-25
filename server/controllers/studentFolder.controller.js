const Folder = require('../models/Folder.model');
const Attempt = require('../models/Attempt');

// @desc    Get all folders assigned to the current student
// @route   GET /api/student/folders (moved from server/routes to server/controllers)
const getMyFolders = async (req, res) => {
  try {
    const studentId = req.user._id;
    const folders = await Folder.find({ allowedUsers: studentId })
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

    const foldersWithStats = folders.map(folder => {
      const folderObj = folder.toObject();
      const total = folder.quizzes?.length || 0;
      const completed = folder.quizzes?.filter(q => completedQuizIds.has(q._id.toString())).length || 0;
      
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
    const folder = await Folder.findOne({ _id: req.params.id, allowedUsers: req.user._id })
      .populate('quizzes');

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found or access denied' });
    }

    res.json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMyFolders, getFolderById };