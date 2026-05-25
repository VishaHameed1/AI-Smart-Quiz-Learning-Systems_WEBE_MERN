import api from './api';

export const register = async (payload) => {
  const res = await api.post('/auth/register', payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

export const me = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put('/auth/profile', payload);
  return res.data;
};

export default { register, login, me, updateProfile };
