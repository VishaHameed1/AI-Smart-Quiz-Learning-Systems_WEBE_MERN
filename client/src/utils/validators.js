export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateQuizTitle = (title) => {
  return title && title.trim().length >= 3;
};

export const validateQuestionText = (text) => {
  return text && text.trim().length >= 5;
};

export const validateOptions = (options) => {
  return options && options.length >= 2 && options.every(opt => opt.trim());
};
