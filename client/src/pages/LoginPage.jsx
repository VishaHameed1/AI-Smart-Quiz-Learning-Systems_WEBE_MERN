import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      
      if (res && res.success) {
        toast.success('Login successful!');
        const userObj = res.data;

        // Check for onboarding or role-specific dashboard
        if (!userObj.onboardingCompleted) {
          if (userObj.role === 'teacher') navigate('/onboarding/teacher');
          else if (userObj.role === 'admin') navigate('/onboarding/admin');
          else navigate('/role-selection'); 
        } else {
          navigate(`/dashboard/${userObj.role}`);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_18%),radial-gradient(circle_at_top_right,_rgba(167,139,250,0.08),_transparent_22%),#eef2ff] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="glass-panel p-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Welcome back</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Login to your account</h1>
            <p className="mt-3 text-sm text-slate-600">Access quizzes, review sessions, and progress insights.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="glass-button w-full text-center disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-slate-900 hover:text-indigo-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
