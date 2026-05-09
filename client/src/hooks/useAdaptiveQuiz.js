import { useState } from 'react';

export const useAdaptiveQuiz = () => {
  const [difficulty, setDifficulty] = useState('medium');
  const [streak, setStreak] = useState(0);

  const updateDifficulty = (isCorrect) => {
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= 3 && difficulty === 'medium') {
        setDifficulty('hard');
      } else if (newStreak >= 3 && difficulty === 'easy') {
        setDifficulty('medium');
      }
    } else {
      setStreak(0);
      if (difficulty === 'hard') setDifficulty('medium');
      else if (difficulty === 'medium') setDifficulty('easy');
    }
  };

  return { difficulty, updateDifficulty };
};
