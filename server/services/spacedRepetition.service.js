 // SM-2 Algorithm for spaced repetition
const calculateNextReview = (quality, repetitions, easeFactor, interval) => {
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
  }
  
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, Math.min(easeFactor, 2.5));
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  
  return { nextReviewDate, repetitions, easeFactor, interval };
};

module.exports = { calculateNextReview };
