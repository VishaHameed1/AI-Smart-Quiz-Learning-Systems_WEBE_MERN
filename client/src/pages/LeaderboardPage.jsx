import React from 'react';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl glass-panel p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Leaderboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Top performers</h1>
          </div>
          <button className="glass-button">View all rankings</button>
        </div>

        <div className="mt-8 space-y-4">
          {['1st', '2nd', '3rd'].map((place, index) => (
            <div key={place} className="glass-panel p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{place} place</p>
                <h2 className="text-xl font-semibold text-slate-900">User {index + 1}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{90 - index * 5}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
