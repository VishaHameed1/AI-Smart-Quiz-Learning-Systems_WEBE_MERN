import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Recent Activity</h3>
      {activities.map((act, i) => (
        <div key={i} className="py-1 border-b">{act.message}</div>
      ))}
    </div>
  );
};

export default RecentActivity;
