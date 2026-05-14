import React from 'react';
import { Check, Play } from 'lucide-react';

const ProgressTimeline = ({ steps }) => {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-card">
      <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Learning progress</h3>
      <div className="relative mt-6 pl-6">
        <div className="absolute left-5 top-0 h-full w-px bg-slate-200" />
        <div className="space-y-7">
          {steps.map((step) => (
            <div key={step.title} className="relative flex items-start gap-4">
              <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-white shadow-sm">
                {step.status === 'completed' ? (
                  <Check className="h-4 w-4 text-white bg-green-500 rounded-full" />
                ) : step.status === 'active' ? (
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-white">
                    <Play className="h-3 w-3" />
                    <span className="absolute inset-0 rounded-full animate-ping bg-[#2563eb]/40" />
                  </div>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-500"> </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="mt-1 text-sm text-slate-500">{step.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressTimeline;
