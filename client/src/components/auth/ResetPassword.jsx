import React from 'react';

const ResetPassword = () => {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 lg:px-8">
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-5">Reset Password</h2>
        <form className="space-y-4">
          <input type="password" placeholder="New Password" className="glass-input" />
          <button className="glass-button w-full text-center">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
