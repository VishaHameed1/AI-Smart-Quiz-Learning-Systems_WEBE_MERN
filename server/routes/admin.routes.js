const express = require('express');
const router = express.Router();
const { 
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
  deleteUser 
} = require('../controllers/adminController');
const { auth, roleCheck } = require('../middleware/auth');

router.use(auth);
router.use(roleCheck(['admin']));

router.route('/folders').get(getAllFolders).post(createFolder);
router.route('/folders/:id').get(getFolderById).put(updateFolder).delete(deleteFolder);

router.get('/quizzes', getAllQuizzes);
router.get('/users-for-selection', getUsersForSelection);

router.route('/users').get(getAllUsers).post(createUser);
router.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;