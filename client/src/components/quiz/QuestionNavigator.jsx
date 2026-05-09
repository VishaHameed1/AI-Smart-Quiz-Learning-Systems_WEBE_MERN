import React from 'react';

const QuestionNavigator = ({ total, current, onSelect }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={p-2 rounded text-center }
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
};

export default QuestionNavigator;
