const { body, validationResult } = require('express-validator');

// Quiz validation rules
const validateQuiz = [
  body('title').notEmpty().withMessage('Title is required').trim().isLength({ min: 3, max: 100 }),
  body('description').optional().trim(),
  body('type').isIn(['timed', 'practice', 'adaptive', 'competitive']),
  body('duration').isInt({ min: 1, max: 180 }).withMessage('Duration must be between 1-180 minutes'),
  body('passingScore').isInt({ min: 0, max: 100 }),
  body('difficulty').isIn(['easy', 'medium', 'hard', 'expert']),
];

// Question validation rules
const validateQuestion = [
  body('text').notEmpty().withMessage('Question text is required'),
  body('type').isIn(['mcq', 'multiple-select', 'true-false', 'fill-blanks', 'code']),
  body('options').isArray().custom((value) => {
    if (value && value.length < 2) throw new Error('At least 2 options required');
    return true;
  }),
  body('correctAnswer').notEmpty(),
  body('topic').notEmpty(),
  body('difficulty').isIn(['easy', 'medium', 'hard', 'expert']),
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateQuiz,
  validateQuestion,
  handleValidationErrors,
};