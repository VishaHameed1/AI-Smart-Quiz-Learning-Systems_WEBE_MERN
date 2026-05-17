import api from './api';

const getAllUsers = () => api.get('/admin/users');
const updateUser = (userId, updates) => api.put(`/admin/users/${userId}`, updates);
const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
const createUser = (userData) => api.post('/admin/users', userData);

const fullCleanup = () => api.post('/cleanup/full');
const deleteOldAttempts = (days) => api.delete(`/cleanup/attempts/old/${days}`);
const deleteAbandonedAttempts = (days) => api.delete(`/cleanup/attempts/abandoned/${days}`);
const deleteOldReviews = (days) => api.delete(`/cleanup/review/old/${days}`);
const deleteProgressHistory = () => api.delete('/cleanup/progress/history');
const deleteAICache = () => api.delete('/cleanup/ai/cache');

export default {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  fullCleanup,
  deleteOldAttempts,
  deleteAbandonedAttempts,
  deleteOldReviews,
  deleteProgressHistory,
  deleteAICache,
};
