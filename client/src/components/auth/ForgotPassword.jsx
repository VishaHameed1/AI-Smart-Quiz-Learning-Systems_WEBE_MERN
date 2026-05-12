import React from 'react';

const ForgotPassword = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <p className="mb-4">Enter your email to reset password</p>
      <form>
        <input type="email" placeholder="Email" className="w-full border p-2 rounded mb-4" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
