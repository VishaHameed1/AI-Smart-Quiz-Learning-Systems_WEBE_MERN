﻿import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import toast from 'react-hot-toast';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 60,
    difficulty: 'medium',
    type: 'practice',
    instructions: '',
    requiresEnrollment: false,
  });
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState(''); // New state for new folder name
  const [selectedFolder, setSelectedFolder] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await api.get('/teacher/folders');
        setFolders(res.data.data || []);
      } catch (err) {
        console.error("Failed to load folders");
      }
    };
    fetchFolders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/quizzes/create', quiz);
      const quizId = response.data.data._id;

      let targetFolderId = selectedFolder;

      // Agar naya folder name diya gaya hai, toh usko prioritize karo
      if (newFolderName.trim()) {
        // Check if folder with this name already exists for the teacher
        const existingFolder = folders.find(f => f.name.toLowerCase() === newFolderName.trim().toLowerCase());
        
        if (existingFolder) {
          targetFolderId = existingFolder._id;
        } else {
          // Agar nahi hai toh naya folder banao
          const newFolderRes = await api.post('/teacher/folders', { name: newFolderName.trim() });
          targetFolderId = newFolderRes.data.data._id;
        }
      }

      // Agar koi folder select ya create hua hai, toh quiz ko usmein add karo
      if (targetFolderId) {
        await api.put(`/teacher/folders/${targetFolderId}`, {
          addQuizId: quizId // Backend controller will handle adding this quiz ID
        });
        toast.success(`Quiz added to folder: ${newFolderName || folders.find(f => f._id === targetFolderId)?.name}`);
      }

      navigate(`/teacher/quiz/${quizId}/questions`);
    } catch (err) {
      console.error(err);
      alert('Failed to create quiz: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'emerald' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'hard', label: 'Hard', color: 'orange' },
    { value: 'expert', label: 'Expert', color: 'red' }
  ];

  const typeOptions = [
    { value: 'practice', label: 'Practice' },
    { value: 'timed', label: 'Timed' },
    { value: 'adaptive', label: 'Adaptive' },
    { value: 'competitive', label: 'Competitive' }
  ];

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">✨ Create New Quiz</h1>
          <p className="text-slate-400 mt-1">Design a quiz for your students</p>
        </div>

        <GlassCard className="p-8" glowLine>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Folder Classification */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Classify into Folder (Optional)</label>
              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={selectedFolder}
                  onChange={(e) => {
                    setSelectedFolder(e.target.value);
                    setNewFolderName(''); // Clear new folder name if existing is selected
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                >
                  <option value="" className="bg-slate-900">-- Select Existing Folder --</option>
                  {folders.map(f => (
                    <option key={f._id} value={f._id} className="bg-slate-900">{f.name}</option>
                  ))}
                </select>
                <span className="text-slate-500 flex items-center justify-center">OR</span>
                <input
                  type="text"
                  placeholder="Create New Folder"
                  value={newFolderName}
                  onChange={(e) => {
                    setNewFolderName(e.target.value);
                    setSelectedFolder(''); // Clear selected folder if new name is typed
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic">
                Select an existing folder or type a new name to create one. If a new name matches an existing folder, the quiz will be added to that folder.
              </p>
            </div>

            {/* Quiz Title */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Quiz Title *</label>
              <input
                type="text"
                placeholder="e.g., JavaScript Basics"
                value={quiz.title}
                onChange={(e) => setQuiz({...quiz, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="Describe what this quiz covers..."
                value={quiz.description}
                onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition"
                rows="3"
              />
            </div>

            {/* Duration & Passing Score */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={quiz.duration}
                  onChange={(e) => setQuiz({...quiz, duration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quiz.passingScore}
                  onChange={(e) => setQuiz({...quiz, passingScore: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Difficulty Level</label>
              <div className="flex flex-wrap gap-3">
                {difficultyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setQuiz({...quiz, difficulty: opt.value})}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      quiz.difficulty === opt.value
                        ? `bg-${opt.color}-500/30 border border-${opt.color}-500 text-${opt.color}-400`
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz Type */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Quiz Type</label>
              <div className="grid grid-cols-2 gap-3">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setQuiz({...quiz, type: opt.value})}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      quiz.type === opt.value
                        ? 'bg-cyan-500/30 border border-cyan-500 text-cyan-400'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enrollment Toggle */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <input
                type="checkbox"
                id="requiresEnrollment"
                checked={quiz.requiresEnrollment}
                onChange={(e) => setQuiz({...quiz, requiresEnrollment: e.target.checked})}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
              <label htmlFor="requiresEnrollment" className="text-sm font-medium text-slate-300 cursor-pointer">
                Requires Enrollment (Students must request access)
              </label>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Instructions (Optional)</label>
              <textarea
                placeholder="Add any special instructions for students..."
                value={quiz.instructions}
                onChange={(e) => setQuiz({...quiz, instructions: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                rows="2"
              />
            </div>

            <CyanButton type="submit" disabled={loading} fullWidth glow>
              {loading ? 'Creating...' : 'Create Quiz & Add Questions →'}
            </CyanButton>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default CreateQuiz;