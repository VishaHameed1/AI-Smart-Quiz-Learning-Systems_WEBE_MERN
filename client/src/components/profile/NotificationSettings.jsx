import React from 'react';

const NotificationSettings = ({ settings = {}, onToggle }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Notification Settings</h3>
      <label className="flex items-center gap-2">
        <input type="checkbox" /> Email Notifications
      </label>
    </div>
  );
};

export default NotificationSettings;
