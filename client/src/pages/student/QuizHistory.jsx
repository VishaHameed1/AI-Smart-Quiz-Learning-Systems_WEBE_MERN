import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizHistory = () => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    axios.get('/api/attempts/user/my-attempts')
      .then(res => setAttempts(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="glass-panel p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">History</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Quiz attempts</h1>
          <p className="mt-3 text-slate-600">Review your past quiz attempts and track your progress over time.</p>
        </div>

        {attempts.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-600">
            <p>No quiz attempts yet. Start taking quizzes to build your history!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div key={attempt._id} className="glass-panel p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{attempt.quizTitle || 'Quiz'}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(attempt.createdAt).toLocaleDateString()} · {new Date(attempt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-slate-900">{attempt.percentageScore}%</p>
                    <p className="text-xs text-slate-500">{attempt.score}/{attempt.questionsCount} correct</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${attempt.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {attempt.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
