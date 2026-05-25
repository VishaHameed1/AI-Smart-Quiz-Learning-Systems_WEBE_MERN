import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserCheck, UserX, Clock, Folder, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/teacher/enrollments/pending');
      setRequests(res.data.data);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleResponse = async (id, status) => {
    try {
      await api.put(`/teacher/enrollments/${id}/respond`, { status });
      toast.success(`Request ${status}`);
      setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#030712] p-6 lg:p-8">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Enrollment Requests</h1>
          <p className="text-slate-400 mt-2 text-lg">Review and manage students waiting to join your private content.</p>
        </div>

        {requests.length === 0 ? (
          <GlassCard className="p-16 text-center" glowLine>
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-slate-500 w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold text-slate-300">All caught up!</h2>
            <p className="text-slate-500 mt-2">No pending enrollment requests at the moment.</p>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {requests.map(request => (
              <GlassCard key={request._id} className="p-6 group" hover3d={false} glowLine>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-cyan-400 font-black text-xl shadow-lg uppercase">
                      {request.student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {request.student.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <Mail className="w-3.5 h-3.5" />
                        {request.student.email}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                          <Clock className="w-3 h-3" />
                          Quiz: {request.quiz?.title || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                          <Folder className="w-3 h-3" />
                          Folder: {request.folderName || 'General'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end lg:self-center">
                    <button 
                      onClick={() => handleResponse(request._id, 'accepted')}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                      <UserCheck className="w-4 h-4" />
                      Accept
                    </button>
                    <button 
                      onClick={() => handleResponse(request._id, 'rejected')}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-red-400 font-bold hover:bg-red-500/10 hover:border-red-500/30 transition-all active:scale-95"
                    >
                      <UserX className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentRequests;