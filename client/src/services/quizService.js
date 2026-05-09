import api from './api';

export const getAllQuizzes = async (params = {}) => {
  const response = await api.get('/quizzes', { params });
  return response.data;
};

export const getQuizById = async (id) => {
  const response = await api.get(/quizzes/);
  return response.data;
};

export const createQuiz = async (quizData) => {
  const response = await api.post('/quizzes/create', quizData);
  return response.data;
};

export const updateQuiz = async (id, quizData) => {
  const response = await api.put(/quizzes/, quizData);
  return response.data;
};

export const deleteQuiz = async (id) => {
  const response = await api.delete(/quizzes/);
  return response.data;
};
