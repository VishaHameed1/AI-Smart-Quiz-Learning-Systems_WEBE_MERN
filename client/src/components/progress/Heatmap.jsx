import React from 'react';

const Heatmap = ({ data = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Activity Heatmap</h3>
      <div className="grid grid-cols-7 gap-1">
        {data.map((day, i) => (
          <div key={i} className="w-8 h-8 bg-green-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
