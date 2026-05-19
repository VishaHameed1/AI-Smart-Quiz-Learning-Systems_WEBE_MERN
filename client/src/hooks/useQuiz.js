import { useState } from 'react';
import api from '../services/api';

export const useQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuiz = async (quizId) => {
    setLoading(true);
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch quiz');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (attemptId, questionId, answer, timeTaken) => {
    try {
      const response = await api.post(`/attempts/${attemptId}/submit-answer`, {
        questionId,
        selectedAnswer: answer,
        timeTaken,
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
      return null;
    }
  };

  return { loading, error, fetchQuiz, submitAnswer };
};
