const validator = {};

// Validate email
validator.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
validator.isStrongPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Validate MongoDB ObjectId
validator.isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Validate quiz data
validator.validateQuizData = (quiz) => {
  const errors = [];
  
  if (!quiz.title || quiz.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (quiz.duration && (quiz.duration < 1 || quiz.duration > 180)) {
    errors.push('Duration must be between 1-180 minutes');
  }
  
  if (quiz.passingScore && (quiz.passingScore < 0 || quiz.passingScore > 100)) {
    errors.push('Passing score must be between 0-100');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Validate question data
validator.validateQuestionData = (question) => {
  const errors = [];
  
  if (!question.text || question.text.length < 5) {
    errors.push('Question text must be at least 5 characters');
  }
  
  if (question.type === 'mcq' && (!question.options || question.options.length < 2)) {
    errors.push('MCQ questions must have at least 2 options');
  }
  
  if (!question.correctAnswer) {
    errors.push('Correct answer is required');
  }
  
  return { isValid: errors.length === 0, errors };
};

module.exports = validator;