import React, { useState } from 'react';

const ProfileSettings = ({ user, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Profile Settings</h3>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded mb-2" />
      <button onClick={() => onUpdate({ name })} className="bg-blue-600 text-white p-2 rounded">Save</button>
    </div>
  );
};

export default ProfileSettings;
