import api from './api';

export const startQuiz = async (quizId) => {
  const response = await api.post(/attempts/quiz//start);
  return response.data;
};

export const submitAnswer = async (attemptId, questionId, answer, timeTaken) => {
  const response = await api.post(/attempts//submit-answer, {
    questionId,
    selectedAnswer: answer,
    timeTaken
  });
  return response.data;
};

export const completeQuiz = async (attemptId) => {
  const response = await api.post(/attempts//complete);
  return response.data;
};

export const getResults = async (attemptId) => {
  const response = await api.get(/attempts//results);
  return response.data;
};
