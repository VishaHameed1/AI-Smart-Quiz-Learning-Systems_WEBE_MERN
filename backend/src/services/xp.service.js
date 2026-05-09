 // XP and level calculation
const XP_PER_LEVEL = 100;

const calculateXP = (quizScore, quizMaxScore, timeBonus = 0, streakBonus = 0) => {
  const baseXP = Math.floor((quizScore / quizMaxScore) * 50);
  return baseXP + timeBonus + streakBonus;
};

const calculateLevel = (totalXP) => {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpToNextLevel = XP_PER_LEVEL - (totalXP % XP_PER_LEVEL);
  const currentLevelXp = totalXP % XP_PER_LEVEL;
  
  return { level, totalXP, xpToNextLevel, currentLevelXp };
};

module.exports = { calculateXP, calculateLevel, XP_PER_LEVEL };
