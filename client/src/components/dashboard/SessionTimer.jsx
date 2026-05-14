import React from 'react';

const SessionTimer = ({ hours, minutes, seconds }) => {
  return (
    <div className="rounded-[24px] bg-[#2563eb] p-7 text-white shadow-report">
      <div className="flex items-center justify-between text-sm uppercase tracking-[0.25em] text-blue-100/80">
        <span>Session timer</span>
        <span className="text-xs font-semibold uppercase">Live</span>
      </div>

      <div className="mt-6 text-[3rem] font-[800] font-mono leading-none">{hours}:{minutes}:{seconds}</div>

      <div className="mt-5 grid gap-3 rounded-3xl bg-white/10 p-4 text-[0.65rem] uppercase tracking-[0.3em] text-white/80 sm:grid-cols-3">
        <div className="text-center">
          <p className="text-2xl font-semibold">{hours}</p>
          <p>Hours</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold">{minutes}</p>
          <p>Mins</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold">{seconds}</p>
          <p>Secs</p>
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;
