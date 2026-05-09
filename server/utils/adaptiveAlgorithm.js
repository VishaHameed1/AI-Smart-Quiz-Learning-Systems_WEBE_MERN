// Elo rating system for adaptive difficulty
const K_FACTOR = 32;
const DEFAULT_ELO = 1200;

// Calculate new Elo ratings
const calculateNewElo = (userElo, questionElo, isCorrect) => {
  const expectedScore = 1 / (1 + Math.pow(10, (questionElo - userElo) / 400));
  const actualScore = isCorrect ? 1 : 0;
  
  const newUserElo = userElo + K_FACTOR * (actualScore - expectedScore);
  const newQuestionElo = questionElo + K_FACTOR * (expectedScore - actualScore);
  
  return {
    userElo: Math.round(newUserElo),
    questionElo: Math.round(newQuestionElo),
    expectedScore: expectedScore.toFixed(3)
  };
};

// Get difficulty based on Elo rating
const getDifficultyFromElo = (elo) => {
  if (elo < 1000) return 'easy';
  if (elo < 1300) return 'medium';
  if (elo < 1600) return 'hard';
  return 'expert';
};

// Get next question difficulty based on performance streak
const getNextDifficulty = (consecutiveCorrect, consecutiveWrong, currentDifficulty) => {
  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  let currentIndex = difficulties.indexOf(currentDifficulty);
  
  if (consecutiveCorrect >= 3 && currentIndex < 3) {
    return difficulties[currentIndex + 1];
  }
  
  if (consecutiveWrong >= 2 && currentIndex > 0) {
    return difficulties[currentIndex - 1];
  }
  
  return currentDifficulty;
};

// Calculate mastery level
const calculateMastery = (correctCount, totalAttempts) => {
  if (totalAttempts === 0) return 0;
  const percentage = (correctCount / totalAttempts) * 100;
  
  if (percentage >= 90) return 100;
  if (percentage >= 70) return 80;
  if (percentage >= 50) return 60;
  if (percentage >= 30) return 40;
  return 20;
};

// Determine if user is ready for harder questions
const isReadyForUpgrade = (recentPerformance, minAccuracy = 0.7) => {
  if (recentPerformance.length < 5) return false;
  const recentAccuracy = recentPerformance.filter(r => r).length / recentPerformance.length;
  return recentAccuracy >= minAccuracy;
};

module.exports = {
  calculateNewElo,
  getDifficultyFromElo,
  getNextDifficulty,
  calculateMastery,
  isReadyForUpgrade,
  DEFAULT_ELO,
  K_FACTOR
};