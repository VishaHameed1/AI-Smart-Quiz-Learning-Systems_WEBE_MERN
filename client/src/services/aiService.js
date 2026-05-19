import api from './api';

const AI_BASE = '/ai';

export const generateQuestions = async (data) => {
  const response = await api.post(`${AI_BASE}/generate-questions`, data);
  return response.data.data;
};

export const generateFromText = async (text, numberOfQuestions = 5) => {
  const response = await api.post(`${AI_BASE}/generate-from-text`, { text, numberOfQuestions });
  return response.data.data;
};

export const explainAnswer = async (question, userAnswer, correctAnswer) => {
  const response = await api.post(`${AI_BASE}/explain-answer`, { question, userAnswer, correctAnswer });
  return response.data.explanation || response.data.data;
};

export default {
  generateQuestions,
  generateFromText,
  explainAnswer,
};
