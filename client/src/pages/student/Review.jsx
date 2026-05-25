import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { History, BrainCircuit, CheckCircle, XCircle, Award, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const Review = () => {
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' or 'history'
  const [stats, setStats] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchQueue(); 
    fetchStats(); 
    fetchHistory();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/review/spaced-queue');
      setQueue(res.data.data || []);
    } catch (err) { 
      console.error('Failed to load review queue', err); 
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/review/history');
      setHistory(res.data.data || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/gamification/profile'); // Fetch gamification profile for streak
      setStats(res.data.data);
    } catch (err) { 
      console.error('Failed to load stats', err); 
    }
  };

  // Component to render MCQ vs Theoretical logic
  const QuestionReviewCard = ({ answer, question }) => {
    const isTheoretical = question.type === 'theoretical';

    return (
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h4 className="text-lg font-semibold text-slate-100">{question.text}</h4>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isTheoretical ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {question.type}
          </span>
        </div>

        {isTheoretical ? (
          <div className="space-y-4 pt-2">
            {/* Scenario B: Theoretical Layout */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Your Answer</p>
              <p className="text-sm text-slate-300 italic">"{answer.selectedAnswer || answer.userAnswer}"</p>
            </div>
            
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-[10px] font-bold text-emerald-500 uppercase mb-2">Reference Answer (Ideal)</p>
              <p className="text-sm text-slate-200">{question.correctAnswer}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center gap-3">
                <Award className="text-cyan-400" size={20} />
                <div>
                  <p className="text-[10px] font-bold text-cyan-500 uppercase">Marks Obtained</p>
                  <p className="text-sm font-bold text-white">{answer.pointsEarned} / {question.points || 5}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                <MessageSquare className="text-amber-400 shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-amber-500 uppercase">Groq AI Evaluation</p>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{answer.feedback || "Conceptual relevance check complete."}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Scenario A: MCQ Layout */
          <div className="grid grid-cols-1 gap-2 pt-2">
            {question.options?.map((option, idx) => {
              const isCorrect = option === question.correctAnswer;
              const isStudentChoice = option === (answer.selectedAnswer || answer.userAnswer);
              
              let borderClass = "border-white/5 bg-white/5";
              let icon = null;

              if (isCorrect) {
                borderClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
                icon = <CheckCircle size={14} />;
              } else if (isStudentChoice && !isCorrect) {
                borderClass = "border-rose-500/50 bg-rose-500/10 text-rose-400";
                icon = <XCircle size={14} />;
              }

              return (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${borderClass}`}>
                  <span>{option}</span>
                  {icon}
                </div>
              );
            })}
          </div>
        )}
        
        {question.explanation && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-2 border-cyan-500">
            <p className="text-[10px] font-bold text-cyan-400 uppercase mb-1">Key Concept</p>
            <p className="text-xs text-slate-400 italic leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  const submitQuality = async (quality) => {
    if (!queue[index] || submitting) return;
    setSubmitting(true);
    
    try {
      await api.post(`/review/${queue[index]._id}/submit`, { quality });
      const nextIndex = index + 1;
      if (nextIndex < queue.length) {
        setIndex(nextIndex);
      } else {
        alert('🎉 Review session complete! Great job!');
        navigate('/dashboard/student');
      }
      fetchStats();
    } catch (err) { 
      console.error('Submit review error', err); 
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  const card = queue[index];
  const dueCount = stats?.due || queue.length;

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Performance Review</h1>
            <p className="text-slate-400 mt-1">Strengthen your memory and review past attempts</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeTab === 'queue' ? 'bg-[#00f2ff] text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <BrainCircuit size={16} /> Spaced Review ({queue.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeTab === 'history' ? 'bg-[#00f2ff] text-slate-950 shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <History size={16} /> Attempt History ({history.length})
          </button>
        </div>

        {activeTab === 'queue' ? (
          queue.length > 0 ? (
            <GlassCard className="p-8" glowLine>
               {/* Existing Review Card UI */}
               <h2 className="text-2xl font-bold text-white mb-6">{card.questionId?.text}</h2>
               {/* Quality Buttons */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {[2, 3, 4, 5].map(q => (
                   <button key={q} onClick={() => submitQuality(q)} className="p-3 bg-white/5 rounded-xl border border-white/10 text-white hover:bg-cyan-500/20 transition">{q}</button>
                 ))}
               </div>
            </GlassCard>
          ) : (
            <div className="text-center text-slate-400 py-20">🎉 You're all caught up on reviews!</div>
          )
        ) : (
          <div className="space-y-4">
            {history.map((attempt) => (
              <GlassCard key={attempt._id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">{attempt.quizId?.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                    {Math.round(attempt.percentageScore)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">Completed on: {new Date(attempt.createdAt).toLocaleDateString()}</p>
                  {attempt.answers?.filter(a => a.feedback).map((ans, idx) => (
                    <div key={idx} className="mt-3 p-3 bg-white/5 rounded-lg border-l-4 border-cyan-500">
                      <p className="text-xs font-bold text-cyan-400 flex items-center gap-1 uppercase">
                        <BrainCircuit size={12} /> AI Feedback for Theoretical:
                      </p>
                      <p className="text-sm text-slate-300 mt-1 italic italic italic">"{ans.feedback}"</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;