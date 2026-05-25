import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserCheck, UserX, Clock } from 'lucide-react';
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Enrollment Requests</h1>
      <p className="text-slate-400 mb-8">Review students waiting to join your private quizzes.</p>

      {requests.length === 0 ? (
        <GlassCard className="p-12 text-center text-slate-500">
          No pending enrollment requests.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <GlassCard key={request._id} className="p-6 flex items-center justify-between" glowLine>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">
                  {request.student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-bold">{request.student.name}</h3>
                  <p className="text-sm text-slate-400">{request.student.email}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-cyan-400">
                    <Clock className="w-3 h-3" />
                    Requested for: <span className="font-semibold">{request.quiz.title}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleResponse(request._id, 'accepted')}
                  className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                >
                  <UserCheck className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleResponse(request._id, 'rejected')}
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  <UserX className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollmentRequests;