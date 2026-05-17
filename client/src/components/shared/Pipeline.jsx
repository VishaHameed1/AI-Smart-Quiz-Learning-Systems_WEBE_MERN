import React from 'react';

const Node = ({ label, icon }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-24 h-24 rounded-full bg-white/6 flex items-center justify-center ai-node">
      <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
    </div>
    <div className="text-xs uppercase text-gray-300 mt-2">{label}</div>
  </div>
);

const Pipeline = () => {
  return (
    <div className="w-full flex items-center justify-between gap-8 py-8">
      <Node label="input.json" icon={<span className="text-cyan-300">{`{}`}</span>} />
      <div className="flex-1 h-px border-t border-dashed border-gray-700 mx-4" />
      <Node label="AI Runtime" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#00f2ff" strokeWidth="1.5"/></svg>} />
      <div className="flex-1 h-px border-t border-dashed border-gray-700 mx-4" />
      <Node label="terminal" icon={<span className="text-yellow-300">$</span>} />
      <div className="flex-1 h-px border-t border-dashed border-gray-700 mx-4" />
      <Node label="deploy" icon={<span className="text-purple-300">🚀</span>} />
    </div>
  );
};

export default Pipeline;
