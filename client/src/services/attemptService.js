import api from './api';

export const startQuiz = async (quizId) => {
  const response = await api.post(`/attempts/quiz/${quizId}/start`);
  return response.data.data;
};

export const submitAnswer = async (attemptId, questionId, answer, timeTaken) => {
  const response = await api.post(`/attempts/${attemptId}/submit-answer`, {
    questionId,
    selectedAnswer: answer,
    timeTaken,
  });
  return response.data.data;
};

export const completeQuiz = async (attemptId) => {
  const response = await api.post(`/attempts/${attemptId}/complete`);
  return response.data.data;
};

export const getResults = async (attemptId) => {
  const response = await api.get(`/attempts/${attemptId}/results`);
  return response.data.data;
};
