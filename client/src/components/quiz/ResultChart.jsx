import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ResultChart = ({ correct, incorrect }) => {
  const data = [
    { name: 'Correct', value: correct, color: '#10B981' },
    { name: 'Incorrect', value: incorrect, color: '#EF4444' },
  ];

  return (
    <PieChart width={400} height={300}>
      <Pie data={data} cx="50%" cy="50%" dataKey="value" label>
        {data.map((entry, index) => (
         <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default ResultChart;
