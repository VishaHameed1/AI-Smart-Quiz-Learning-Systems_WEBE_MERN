import React from 'react';
import { UserCircle2 } from 'lucide-react';

const CandidateQueue = ({ queue }) => {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Today's Queue</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Interview candidates</h3>
        </div>
      </div>

      <div className="mt-6 space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {queue.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-[16px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <UserCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateQueue;
