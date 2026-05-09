import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const getTimerColor = () => {
    if (timeLeft < 60) return 'text-red-600';
    if (timeLeft < 300) return 'text-orange-500';
    return 'text-gray-700';
  };

  return (
    <div className={`flex items-center gap-2 font-mono text-xl ${getTimerColor()}`}>
      <AlertTriangle className="w-5 h-5" />
      <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};

export default Timer;