// Just re-export from validation.js
const { handleValidationErrors, validateQuiz, validateQuestion } = require('./validation');

module.exports = {
  handleValidationErrors,
  validateQuiz,
  validateQuestion,
  validate: handleValidationErrors
};