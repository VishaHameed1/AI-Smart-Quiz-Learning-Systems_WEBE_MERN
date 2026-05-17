import React, { useState } from 'react';
import adminService from '../../services/adminService';

const AdminCleanup = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const runTask = async (task, label) => {
    setMessage('');
    setError('');
    try {
      const response = await task();
      setMessage(`${label} completed successfully.`);
      return response;
    } catch (err) {
      console.error(err);
      setError(`Failed to run ${label}.`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-slate-100 mb-4">Admin Cleanup Tools</h1>
      <p className="text-slate-400 mb-6">Run maintenance operations to archive or remove stale data safely.</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mb-6">
        <button
          onClick={() => runTask(adminService.fullCleanup, 'Full cleanup')}
          className="rounded-xl bg-slate-800 p-6 text-left text-white hover:bg-slate-700 transition"
        >
          <h2 className="font-semibold mb-2">Full cleanup</h2>
          <p className="text-slate-400">Remove old attempts, stale reviews, and cached AI question data.</p>
        </button>
        <button
          onClick={() => runTask(() => adminService.deleteOldAttempts(30), 'Delete old attempts')}
          className="rounded-xl bg-slate-800 p-6 text-left text-white hover:bg-slate-700 transition"
        >
          <h2 className="font-semibold mb-2">Delete attempts older than 30 days</h2>
          <p className="text-slate-400">Clear historical attempts no longer needed for reporting.</p>
        </button>
        <button
          onClick={() => runTask(() => adminService.deleteAbandonedAttempts(7), 'Delete abandoned attempts')}
          className="rounded-xl bg-slate-800 p-6 text-left text-white hover:bg-slate-700 transition"
        >
          <h2 className="font-semibold mb-2">Delete abandoned attempts</h2>
          <p className="text-slate-400">Remove in-progress attempts older than 7 days.</p>
        </button>
        <button
          onClick={() => runTask(() => adminService.deleteOldReviews(365), 'Delete old reviews')}
          className="rounded-xl bg-slate-800 p-6 text-left text-white hover:bg-slate-700 transition"
        >
          <h2 className="font-semibold mb-2">Delete stale reviews</h2>
          <p className="text-slate-400">Archive spaced repetition records older than one year.</p>
        </button>
        <button
          onClick={() => runTask(adminService.deleteProgressHistory, 'Delete progress history')}
          className="rounded-xl bg-slate-800 p-6 text-left text-white hover:bg-slate-700 transition"
        >
          <h2 className="font-semibold mb-2">Delete progress history</h2>
          <p className="text-slate-400">Remove old progress data where available.</p>
        </button>
        <button
          onClick={() => runTask(adminService.deleteAICache, 'Delete AI cache')}
          className="rounded-xl bg-slate-800 p-6 text-left text-white hover:bg-slate-700 transition"
        >
          <h2 className="font-semibold mb-2">Clear AI cache</h2>
          <p className="text-slate-400">Remove cached AI-generated content older than 30 days.</p>
        </button>
      </div>

      {message && <div className="rounded-xl bg-emerald-600 p-4 text-white mb-4">{message}</div>}
      {error && <div className="rounded-xl bg-red-600 p-4 text-white mb-4">{error}</div>}
    </div>
  );
};

export default AdminCleanup;
