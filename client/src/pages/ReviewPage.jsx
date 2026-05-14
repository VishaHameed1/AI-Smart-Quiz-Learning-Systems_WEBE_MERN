import React from 'react';
import { useAuth } from '../hooks/useAuth';

const ReviewPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="glass-panel p-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Spaced repetition</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Review queue</h1>
          <p className="mt-4 text-slate-600">Questions due for review will appear here when your learning pattern needs reinforcement.</p>
        </div>

        <div className="glass-panel p-8 text-center">
          <p className="text-slate-600 mb-4">Welcome back, {user?.name || 'Learner'}!</p>
          <div className="mx-auto max-w-xl rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <p className="text-lg font-semibold">🔄 No questions due for review right now. Great job!</p>
            <p className="mt-3 text-sm text-amber-700">Keep practicing to maintain your streak and unlock new badges.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;