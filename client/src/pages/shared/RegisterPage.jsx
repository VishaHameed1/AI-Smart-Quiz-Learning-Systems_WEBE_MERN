import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (f) => {
    const e = {};
    if (!f.name) e.name = 'Name is required';
    if (!f.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Invalid email format';
    if (!f.password) e.password = 'Password is required';
    else if (f.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (f.password !== f.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    setErrors(validate(updated));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const eobj = validate(form);
  setErrors(eobj);
  if (Object.keys(eobj).length) return;
  setLoading(true);
  try {
    await register({ name: form.name, email: form.email, password: form.password, role: form.role });
    alert('Registration successful! Please login.');
    navigate('/login');
  } catch (err) {
    setErrors({ general: err.response?.data?.message || 'Registration failed' });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      {/* Radial gradient accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <GlassCard className="max-w-md w-full p-8 relative z-10" glowLine>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Start your learning journey</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
              placeholder="John Doe"
            />
            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
              placeholder="you@example.com"
            />
            {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
              placeholder="••••••••"
            />
            {errors.password && <div className="text-red-400 text-xs mt-1">{errors.password}</div>}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
              placeholder="••••••••"
            />
            {errors.confirm && <div className="text-red-400 text-xs mt-1">{errors.confirm}</div>}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">I am a</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={form.role === 'student'}
                  onChange={handleChange}
                  className="w-4 h-4 text-cyan-400 bg-white/5 border-white/20 focus:ring-cyan-400/40"
                />
                <span className="text-slate-300">Student</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={form.role === 'teacher'}
                  onChange={handleChange}
                  className="w-4 h-4 text-cyan-400 bg-white/5 border-white/20 focus:ring-cyan-400/40"
                />
                <span className="text-slate-300">Teacher</span>
              </label>
            </div>
          </div>

          <CyanButton type="submit" fullWidth disabled={loading} glow>
            {loading ? 'Creating account...' : 'Create Account'}
          </CyanButton>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-slate-500">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition">
            <span>G</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition">
            <span>🐙</span> GitHub
          </button>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default RegisterPage;