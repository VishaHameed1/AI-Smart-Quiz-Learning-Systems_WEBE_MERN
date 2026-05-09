// Quiz types
const QUIZ_TYPES = {
  TIMED: 'timed',
  PRACTICE: 'practice',
  ADAPTIVE: 'adaptive',
  COMPETITIVE: 'competitive',
};

// Difficulty levels
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
};

// Question types
const QUESTION_TYPES = {
  MCQ: 'mcq',
  MULTIPLE_SELECT: 'multiple-select',
  TRUE_FALSE: 'true-false',
  FILL_BLANKS: 'fill-blanks',
  MATCHING: 'matching',
  CODE: 'code',
};

// User roles
const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  PREMIUM: 'premium_student',
};

// Default values
const DEFAULT_VALUES = {
  QUIZ_DURATION: 30, // minutes
  PASSING_SCORE: 60, // percentage
  MAX_QUESTIONS_PER_QUIZ: 100,
  MIN_QUESTIONS_PER_QUIZ: 1,
  AI_BATCH_SIZE: 10,
  ELO_K_FACTOR: 32,
  DEFAULT_ELO_RATING: 1200,
};

// API response messages
const RESPONSE_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'Something went wrong',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation error',
};

module.exports = {
  QUIZ_TYPES,
  DIFFICULTY_LEVELS,
  QUESTION_TYPES,
  USER_ROLES,
  DEFAULT_VALUES,
  RESPONSE_MESSAGES,
};