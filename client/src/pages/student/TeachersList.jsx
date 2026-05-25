import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { startQuiz as startQuizAttempt } from '../../services/attemptService';
import toast from 'react-hot-toast';
import { BookOpen, ChevronRight, ChevronDown, User, Mail, Search, PlayCircle, Lock } from 'lucide-react';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/student/enrollments/teachers');
      setTeachers(res.data.data);
    } catch (error) {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const attempt = await startQuizAttempt(quizId);
      if (attempt && attempt._id) {
        navigate(`/quiz/${quizId}/take/${attempt._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to start quiz");
    }
  };

  const handleEnrollRequest = async (quizId, teacherId) => {
    try {
      const res = await api.post(`/student/enrollments/request`, { quizId });
      if (res.data.success) {
        toast.success("Enrollment request sent!");
        setTeachers(prev => prev.map(t => {
          if (t._id === teacherId) {
            return {
              ...t,
              quizzes: t.quizzes.map(q => q._id === quizId ? { ...q, enrollmentStatus: 'pending' } : q)
            };
          }
          return t;
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.quizzes.some(quiz => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white">Browse Teachers</h1>
        <p className="text-slate-400 mt-2">Find instructors and join their quizzes.</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-8 max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search teachers by name, email, or quiz title..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeachers.map((teacher) => (
          <GlassCard 
            key={teacher._id} 
            className={`flex flex-col h-full group transition-all duration-300 ${expandedTeacher === teacher._id ? 'ring-2 ring-cyan-500/50' : ''}`} 
            hover3d={expandedTeacher !== teacher._id}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-2xl font-black text-slate-950 uppercase shadow-lg shadow-cyan-500/20">
                {teacher.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{teacher.name}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-1"><Mail size={12}/> {teacher.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div 
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                  expandedTeacher === teacher._id ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setExpandedTeacher(expandedTeacher === teacher._id ? null : teacher._id)}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <BookOpen className={`w-4 h-4 ${expandedTeacher === teacher._id ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {teacher.quizzes.length} Available Quizzes
                </div>
                {expandedTeacher === teacher._id ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
              </div>

              {expandedTeacher === teacher._id && (
                <div className="space-y-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  {teacher.quizzes.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-2">No quizzes published yet.</p>
                  ) : (
                    teacher.quizzes.map(quiz => (
                      <div key={quiz._id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{quiz.title}</h4>
                          <p className="text-[10px] text-slate-500 capitalize">{quiz.difficulty} • {quiz.type}</p>
                        </div>
                        
                        {(!quiz.requiresEnrollment || quiz.enrollmentStatus === 'accepted') ? (
                          <button 
                            onClick={() => handleStartQuiz(quiz._id)}
                            className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition"
                            title="Take Quiz"
                          >
                            <PlayCircle size={18} />
                          </button>
                        ) : quiz.enrollmentStatus === 'pending' ? (
                          <div className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider">Pending</div>
                        ) : quiz.enrollmentStatus === 'rejected' ? (
                          <div className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">Rejected</div>
                        ) : (
                          <button 
                            onClick={() => handleEnrollRequest(quiz._id, teacher._id)}
                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition"
                            title="Request Enrollment"
                          >
                            <Lock size={18} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default TeachersList;