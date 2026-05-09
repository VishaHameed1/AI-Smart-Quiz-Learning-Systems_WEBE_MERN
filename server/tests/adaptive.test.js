const { calculateNewElo, getDifficultyFromElo } = require('../utils/adaptiveAlgorithm');

describe('Adaptive Algorithm Tests', () => {
  test('Elo rating should update correctly', () => {
    const result = calculateNewElo(1200, 1200, true);
    expect(result.userElo).toBeGreaterThan(1200);
  });
  
  test('Difficulty from Elo', () => {
    expect(getDifficultyFromElo(900)).toBe('easy');
    expect(getDifficultyFromElo(1200)).toBe('medium');
    expect(getDifficultyFromElo(1500)).toBe('hard');
  });
});
