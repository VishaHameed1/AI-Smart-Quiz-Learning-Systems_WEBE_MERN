import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6 lg:px-8">
      <div className="glass-panel p-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-5">Forgot Password</h2>
        <p className="text-slate-600 mb-6">Enter your email to receive password reset instructions.</p>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="glass-input" />
          <button className="glass-button w-full text-center">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
