import api from './api';

const getStudents = () => api.get('/teacher/students');
const getStudentProgress = (studentId) => api.get(`/teacher/students/${encodeURIComponent(studentId)}/progress`);
const getAnalytics = () => api.get('/teacher/analytics');
const getClassReport = () => api.get('/teacher/class/report');
const getQuizzes = () => api.get('/teacher/quizzes');

export default {
  getStudents,
  getStudentProgress,
  getAnalytics,
  getClassReport,
  getQuizzes,
};
