import React, { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';

const QuestionCard = ({ question, onSubmit, currentNumber, totalQuestions, timeRemaining }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer && question.type !== 'true-false') {
      alert('Please select an answer');
      return;
    }
    
    onSubmit(selectedAnswer);
    setSubmitted(true);
    setTimeout(() => {
      setSelectedAnswer(null);
      setSubmitted(false);
    }, 500);
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{String.fromCharCode(65 + idx)}. {option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'true-false':
        return (
          <div className="flex gap-4">
            {['True', 'False'].map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      default:
        return <div>Question type not supported</div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header with progress and timer */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="text-sm text-gray-500">
          Question {currentNumber} of {totalQuestions}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>
      
      {/* Question text */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{question.text}</h3>
        {question.codeSnippet && (
          <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
            <code>{question.codeSnippet}</code>
          </pre>
        )}
      </div>
      
      {/* Answer options */}
      {renderQuestionType()}
      
      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={submitted}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {submitted ? (
          <Check className="w-5 h-5 mx-auto" />
        ) : (
          'Submit Answer'
        )}
      </button>
    </div>
  );
};

export default QuestionCard;