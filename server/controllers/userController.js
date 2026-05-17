const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('GetProfile Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password && updates.password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });

    await user.save();
    res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, xp: user.xp, level: user.level } });
  } catch (error) {
    console.error('UpdateProfile Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: 'Old and new passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const ok = await user.comparePassword(oldPassword);
    if (!ok) return res.status(401).json({ success: false, message: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (error) {
    console.error('ChangePassword Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.softDeleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isDeleted = true;
    user.email = `deleted_${user._id}@deleted.local`;
    await user.save();
    res.json({ success: true, message: 'Account deleted (soft)' });
  } catch (error) {
    console.error('SoftDelete Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
