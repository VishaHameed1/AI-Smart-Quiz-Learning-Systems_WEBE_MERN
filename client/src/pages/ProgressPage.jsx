import React from 'react';
import { useProgress } from '../hooks/useProgress';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProgressPage = () => {
  const { progress, loading, error } = useProgress();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="glass-panel p-8">
          <h1 className="text-3xl font-semibold text-slate-950">My Learning Progress</h1>
          <p className="mt-3 text-slate-600">Track mastery, review habits, and stay on pace with your learning goals.</p>
        </div>

        {progress && progress.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-600">
            No progress data yet. Start taking quizzes to see your progress!
          </div>
        ) : (
          <div className="grid gap-6">
            {progress?.map((item, idx) => (
              <div key={idx} className="glass-panel p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{item.topic}</h3>
                    <p className="text-sm text-slate-500 mt-1">Last practiced: {new Date(item.lastPracticed).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Mastery {item.masteryScore}%</span>
                </div>

                <div className="mt-5 rounded-full bg-slate-100 h-3 overflow-hidden">
                  <div className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-violet-500" style={{ width: `${item.masteryScore}%` }} />
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>Questions answered: {item.questionsAttempted}</span>
                  <span>Correct: {item.correctAnswers}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;