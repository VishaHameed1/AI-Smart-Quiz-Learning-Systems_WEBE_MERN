const Folder = require('../models/Folder.model');
const Quiz = require('../models/Quiz'); // To populate quizzes for selection
const User = require('../models/User'); // To populate users for selection
const Gamification = require('../models/Gamification.model');
// @desc    Get all folders (Admin)
// @route   GET /api/admin/folders
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find()
      .populate('createdBy', 'name email')
      .populate('quizzes', 'title')
      .populate('allowedUsers', 'name email');
    res.json({ success: true, data: folders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single folder by ID (Admin)
// @route   GET /api/admin/folders/:id
const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('quizzes', 'title')
      .populate('allowedUsers', 'name email');
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    res.json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new folder (Admin)
// @route   POST /api/admin/folders
const createFolder = async (req, res) => {
  try {
    const { name, description, createdBy, quizzes, allowedUsers } = req.body;
    const newFolder = await Folder.create({
      name,
      description,
      createdBy: createdBy || req.user._id, // Admin can specify creator or default to self
      quizzes,
      allowedUsers,
    });
    res.status(201).json({ success: true, data: newFolder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a folder (Admin)
// @route   PUT /api/admin/folders/:id
const updateFolder = async (req, res) => {
  try {
    const { name, description, createdBy, quizzes, allowedUsers } = req.body;
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { name, description, createdBy, quizzes, allowedUsers, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    res.json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a folder (Admin)
// @route   DELETE /api/admin/folders/:id
const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.params.id);
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    res.json({ success: true, message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all quizzes (for selection in folder management)
// @route   GET /api/admin/quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title createdBy').populate('createdBy', 'name');
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (for selection in folder management)
// @route   GET /api/admin/users-for-selection
const getUsersForSelection = async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password for security
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID (Admin)
// @route   GET /api/admin/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new user (Admin)
// @route   POST /api/admin/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please enter all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    await Gamification.create({ userId: user._id }); // Create gamification profile for new user

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const updateFields = { name, email, role };

    if (password) {
      const user = await User.findById(req.params.id);
      user.password = password; // Pre-save hook will hash it
      await user.save();
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await Gamification.deleteOne({ userId: req.params.id }); // Delete associated gamification profile
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  getAllQuizzes,
  getUsersForSelection,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};