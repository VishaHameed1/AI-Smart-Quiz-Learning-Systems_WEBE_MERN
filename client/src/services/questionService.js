import api from './api';

export const bulkAddQuestions = async (payload) => {
  const response = await api.post('/questions/bulk', payload);
  return response.data;
};

export default {
  bulkAddQuestions,
};