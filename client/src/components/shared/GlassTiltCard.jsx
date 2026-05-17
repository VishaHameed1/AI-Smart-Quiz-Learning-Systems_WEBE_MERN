import React from 'react';

const GlassTiltCard = ({ title, body, icon }) => {
  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="glow-line" aria-hidden></div>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">{body}</p>
        </div>
      </div>
    </div>
  );
};

export default GlassTiltCard;
