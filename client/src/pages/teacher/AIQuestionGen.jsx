import React, { useState } from 'react';
import { generateQuestions } from '../../services/aiService';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AIQuestionGen = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);

  const difficultyOptions = ['easy', 'medium', 'hard', 'expert'];

  const fetchQuestions = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }
    setLoading(true);
    setQuestions([]);
    setSelectedQuestions({});
    try {
      const generated = await generateQuestions({
        topic,
        numberOfQuestions: numQuestions,
        difficulty: difficulty,
      });
      setQuestions(generated || []);
    } catch (err) {
      alert('Failed to generate questions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectQuestion = (idx) => {
    setSelectedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const saveSelectedQuestions = async () => {
    const selectedIndices = Object.keys(selectedQuestions).filter(key => selectedQuestions[key]);
    const selected = questions.filter((_, idx) => selectedIndices.includes(idx.toString()));
    
    if (selected.length === 0) {
      alert('Please select at least one question to save');
      return;
    }

    setSaving(true);
    try {
      // Save each selected question to question bank
      for (const question of selected) {
        await api.post('/questions/create', {
          text: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          difficulty: question.difficulty || difficulty,
          topic: topic,
          type: 'mcq'
        });
      }
      alert(`✅ ${selected.length} questions saved successfully!`);
      setQuestions([]);
      setSelectedQuestions({});
      setTopic('');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save questions: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">🤖 AI Question Generator</h1>
          <p className="text-slate-400 mt-1">Powered by Google Gemini AI</p>
        </div>

        {/* Input Section */}
        <GlassCard className="p-6 mb-8" glowLine>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-2">Topic</label>
              <input
                type="text"
                placeholder="e.g., Machine Learning, JavaScript, World History..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              >
                {difficultyOptions.map(opt => (
                  <option key={opt} value={opt} className="bg-slate-800">{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
              >
                {[3, 5, 10, 15, 20].map(n => (
                  <option key={n} value={n} className="bg-slate-800">{n} questions</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <CyanButton onClick={fetchQuestions} disabled={loading} fullWidth glow>
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </CyanButton>
          </div>
        </GlassCard>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Generated Questions */}
        {questions.length > 0 && !loading && (
          <GlassCard className="p-6" glowLine>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Generated Questions</h2>
              <CyanButton onClick={saveSelectedQuestions} disabled={saving} size="sm" glow>
                {saving ? 'Saving...' : `Save Selected (${Object.values(selectedQuestions).filter(Boolean).length})`}
              </CyanButton>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl transition-all cursor-pointer ${
                    selectedQuestions[idx] 
                      ? 'bg-cyan-500/20 border-2 border-cyan-500' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => toggleSelectQuestion(idx)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded border border-white/20 flex items-center justify-center mt-1">
                      {selectedQuestions[idx] && <span className="text-cyan-400">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{q.question}</p>
                      {q.options && (
                        <div className="mt-2 space-y-1">
                          {q.options.map((opt, i) => (
                            <p key={i} className="text-slate-400 text-sm ml-4">
                              {String.fromCharCode(65+i)}. {opt}
                            </p>
                          ))}
                        </div>
                      )}
                      {q.correctAnswer && (
                        <p className="text-emerald-400 text-sm mt-2">
                          ✓ Correct: {q.correctAnswer}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-slate-500 text-xs mt-1">
                          📖 {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default AIQuestionGen;