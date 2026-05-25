import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../store/slices/authSlice';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Cleanup errors and handle redirects
  useEffect(() => {
    if (isAuthenticated && user) {
      let target;
      if (user.role === 'admin') {
        target = '/dashboard/admin';
      } else if (user.role === 'teacher') {
        target = '/dashboard/teacher';
      } else {
        target = '/dashboard/student';
      }
      navigate(target);
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Registration successful! Welcome aboard.');
    } else {
      toast.error(resultAction.payload || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <GlassCard className="w-full max-w-md p-8" glowLine>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Start your learning journey with AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 outline-none transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 outline-none transition"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {['student', 'teacher'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`py-2 rounded-xl border text-sm font-medium capitalize transition ${
                    formData.role === r
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <CyanButton
            type="submit"
            fullWidth
            glow
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </CyanButton>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default RegisterPage;