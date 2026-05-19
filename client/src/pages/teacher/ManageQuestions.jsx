import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'medium',
    points: 10
  });

  useEffect(() => {
    fetchQuizAndQuestions();
  }, [quizId]);

  const fetchQuizAndQuestions = async () => {
    try {
      const [quizRes, questionsRes] = await Promise.all([
        api.get(`/quizzes/${quizId}`),
        api.get(`/questions/quiz/${quizId}`)
      ]);
      setQuiz(quizRes.data.data);
      setQuestions(questionsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        text: newQuestion.text,
        type: newQuestion.type,
        correctAnswer: newQuestion.correctAnswer,
        explanation: newQuestion.explanation,
        difficulty: newQuestion.difficulty,
        points: newQuestion.points
      };
      
      if (newQuestion.type === 'mcq') {
        payload.options = newQuestion.options.filter(opt => opt.trim() !== '');
      }
      
      const res = await api.post(`/questions/quiz/${quizId}/add`, payload);
      
      if (res.data.success) {
        setQuestions([...questions, res.data.data]);
        setShowAddForm(false);
        setNewQuestion({
          text: '',
          type: 'mcq',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
          difficulty: 'medium',
          points: 10
        });
      } else {
        alert(res.data.message || 'Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add question';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Delete this question permanently?')) {
      try {
        await api.delete(`/questions/${questionId}`);
        setQuestions(questions.filter(q => q._id !== questionId));
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question');
      }
    }
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[idx] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Questions</h1>
            <p className="text-slate-400 mt-1">Quiz: {quiz?.title}</p>
          </div>
          <div className="flex gap-3">
            <CyanButton onClick={() => setShowAddForm(!showAddForm)} size="sm" glow>
              {showAddForm ? 'Cancel' : '+ Add Question'}
            </CyanButton>
            <button 
              onClick={() => navigate('/teacher/quizzes')}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition"
            >
              Back to Quizzes
            </button>
          </div>
        </div>

        {/* Add Question Form */}
        {showAddForm && (
          <GlassCard className="p-6 mb-6" glowLine>
            <h2 className="text-xl font-bold text-white mb-4">New Question</h2>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Question Text *</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {newQuestion.type === 'mcq' && (
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Options (4 options recommended)</label>
                  {newQuestion.options.map((opt, idx) => (
                    <input
                      key={idx}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="w-full mb-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500"
                    />
                  ))}
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Correct Answer *</label>
                <input
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  placeholder="Enter correct answer"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Explanation (Optional)</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  rows="2"
                  placeholder="Explain why this answer is correct"
                />
              </div>

              <CyanButton type="submit" fullWidth glow disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Question'}
              </CyanButton>
            </form>
          </GlassCard>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <GlassCard key={q._id} className="p-5" glowLine>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-cyan-400 font-bold">#{idx + 1}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">{q.type}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">{q.difficulty}</span>
                  </div>
                  <p className="text-white font-medium mb-3">{q.text}</p>
                  {q.type === 'mcq' && q.options && q.options.length > 0 && (
                    <div className="space-y-1 mb-3">
                      {q.options.map((opt, i) => (
                        <p key={i} className={`text-sm ${opt === q.correctAnswer ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {String.fromCharCode(65 + i)}. {opt} {opt === q.correctAnswer && ' ✓'}
                        </p>
                      ))}
                    </div>
                  )}
                  {q.type === 'true-false' && (
                    <div className="space-y-1 mb-3">
                      <p className={`text-sm ${q.correctAnswer === 'True' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        True {q.correctAnswer === 'True' && ' ✓'}
                      </p>
                      <p className={`text-sm ${q.correctAnswer === 'False' ? 'text-emerald-400' : 'text-slate-400'}`}>
                        False {q.correctAnswer === 'False' && ' ✓'}
                      </p>
                    </div>
                  )}
                  {q.explanation && (
                    <p className="text-sm text-slate-500 mt-2">📖 {q.explanation}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="ml-4 px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition"
                >
                  Delete
                </button>
              </div>
            </GlassCard>
          ))}

          {questions.length === 0 && (
            <GlassCard className="text-center py-12">
              <p className="text-slate-400">No questions yet. Add your first question!</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageQuestions;