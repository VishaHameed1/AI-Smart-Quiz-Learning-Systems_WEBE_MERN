 // Mastery calculation service
const calculateMastery = (userAnswers, topic) => {
  let totalPoints = 0;
  let earnedPoints = 0;
  
  userAnswers.forEach(answer => {
    totalPoints += answer.maxPoints || 10;
    if (answer.isCorrect) earnedPoints += answer.maxPoints || 10;
  });
  
  const masteryScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  
  let masteryLevel = 'novice';
  if (masteryScore >= 90) masteryLevel = 'expert';
  else if (masteryScore >= 70) masteryLevel = 'proficient';
  else if (masteryScore >= 50) masteryLevel = 'developing';
  else if (masteryScore >= 30) masteryLevel = 'beginner';
  
  return { masteryScore, masteryLevel };
};

module.exports = { calculateMastery };
