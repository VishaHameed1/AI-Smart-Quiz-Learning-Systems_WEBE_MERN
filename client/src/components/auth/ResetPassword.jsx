import React from 'react';

const ResetPassword = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form>
        <input type="password" placeholder="New Password" className="w-full border p-2 rounded mb-4" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
