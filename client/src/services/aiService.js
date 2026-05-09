import axios from 'axios';

const API_URL = '/api/ai';

export const generateQuestions = async (data) => {
  const response = await axios.post(${API_URL}/generate-questions, data);
  return response.data;
};

export const generateFromText = async (text, numberOfQuestions = 5) => {
  const response = await axios.post(${API_URL}/generate-from-text, { text, numberOfQuestions });
  return response.data;
};

export const explainAnswer = async (question, userAnswer, correctAnswer) => {
  const response = await axios.post(${API_URL}/explain-answer, { question, userAnswer, correctAnswer });
  return response.data;
};

export default {
  generateQuestions,
  generateFromText,
  explainAnswer
};
