import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialMinutes, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  const pauseTimer = useCallback(() => setIsActive(false), []);
  const resumeTimer = useCallback(() => setIsActive(true), []);
  const resetTimer = useCallback((minutes) => {
    setTimeLeft(minutes * 60);
    setIsActive(true);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeLow = timeLeft < 60;
  const percentageLeft = (timeLeft / (initialMinutes * 60)) * 100;

  return {
    timeLeft,
    minutes,
    seconds,
    formattedTime,
    isTimeLow,
    percentageLeft,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };
};