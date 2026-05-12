import React from 'react';
import { useProgress } from '../hooks/useProgress';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProgressPage = () => {
  const { progress, loading, error } = useProgress();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Learning Progress</h1>
      
      {progress && progress.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No progress data yet. Start taking quizzes to see your progress!
        </div>
      )}

      <div className="space-y-4">
        {progress && progress.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{item.topic}</h3>
              <span className="text-sm text-gray-500">
                Last practiced: {new Date(item.lastPracticed).toLocaleDateString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${item.masteryScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Mastery: {item.masteryScore}%</span>
              <span>Questions: {item.questionsAttempted}</span>
              <span>Correct: {item.correctAnswers}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPage;