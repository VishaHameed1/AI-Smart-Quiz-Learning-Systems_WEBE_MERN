 const Notification = require('../models/Notification.model');

const createNotification = async (userId, type, title, message, link = null) => {
  const notification = await Notification.create({
    userId, type, title, message, link, createdAt: new Date()
  });
  return notification;
};

const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ userId, isRead: false });
};

module.exports = { createNotification, getUnreadCount };
