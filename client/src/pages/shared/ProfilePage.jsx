import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', avatar: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data.data);
        setForm({ 
          name: res.data.data.name || '', 
          avatar: res.data.data.avatar || '', 
          password: '' 
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, avatar: form.avatar };
      if (form.password) payload.password = form.password;
      await api.put('/users/profile', payload);
      alert('✅ Profile updated successfully!');
    } catch (err) {
      alert('❌ Update failed: ' + (err.response?.data?.message || 'Server error'));
    } finally { 
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <GlassCard className="text-center p-6" glowLine>
            <div className="mb-4">
              <img 
                src={form.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'User')}&background=00f2ff&color=fff&size=120`} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full mx-auto border-4 border-cyan-500/30"
              />
            </div>
            <h3 className="text-white font-semibold">{form.name || 'User'}</h3>
            <p className="text-slate-400 text-sm">{profile?.email}</p>
            <p className="text-slate-500 text-xs mt-2">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
          </GlassCard>

          {/* Edit Form */}
          <GlassCard className="md:col-span-2 p-6" glowLine>
            <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Avatar URL</label>
                <input 
                  value={form.avatar} 
                  onChange={(e) => setForm({...form, avatar: e.target.value})} 
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-slate-500 text-xs mt-1">Leave empty for auto-generated avatar</p>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">New Password</label>
                <input 
                  type="password" 
                  value={form.password} 
                  onChange={(e) => setForm({...form, password: e.target.value})} 
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                  placeholder="Leave empty to keep current"
                />
              </div>
              <CyanButton type="submit" disabled={loading} fullWidth glow>
                {loading ? 'Saving...' : 'Save Changes'}
              </CyanButton>
            </form>
          </GlassCard>
        </div>

        {/* Danger Zone */}
        <div className="mt-8">
          <GlassCard className="p-6 border-red-500/20">
            <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Danger Zone</h3>
            <p className="text-slate-400 text-sm mb-4">Once you delete your account, there is no going back.</p>
            <button 
              className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition"
              onClick={() => {
                if (window.confirm('Are you sure? This action cannot be undone!')) {
                  // Delete account logic
                }
              }}
            >
              Delete Account
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;