import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Folder, Plus, Edit2, Users, BookOpen, X, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherFolders = () => {
  const [folders, setFolders] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTermQuizzes, setSearchTermQuizzes] = useState('');
  const [searchTermStudents, setSearchTermStudents] = useState('');
  const [currentFolder, setCurrentFolder] = useState({ name: '', description: '', quizzes: [], allowedUsers: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [folderRes, quizRes, studentRes] = await Promise.all([
        api.get('/teacher/folders'),
        api.get('/teacher/quizzes'),
        api.get('/teacher/students')
      ]);
      setFolders(folderRes.data.data);
      setQuizzes(quizRes.data.data);
      setStudents(studentRes.data.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (currentFolder._id) {
        await api.put(`/teacher/folders/${currentFolder._id}`, currentFolder);
        toast.success("Folder updated");
      } else {
        await api.post('/teacher/folders', currentFolder);
        toast.success("Folder created");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Save failed");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!currentFolder._id) {
      toggleSelection(studentId, 'allowedUsers');
      return;
    }

    if (!window.confirm("Are you sure you want to remove this student? This will also notify them via email.")) return;

    try {
      await api.delete(`/teacher/folders/${currentFolder._id}/students/${studentId}`);
      toast.success("Student removed and notified");
      
      const newList = currentFolder.allowedUsers.filter(id => id !== studentId);
      setCurrentFolder({ ...currentFolder, allowedUsers: newList });
      
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    }
  };

  const toggleSelection = (id, field) => {
    const list = [...currentFolder[field]];
    const index = list.indexOf(id);
    if (index > -1) list.splice(index, 1);
    else list.push(id);
    setCurrentFolder({ ...currentFolder, [field]: list });
  };

  const selectAll = (field, items) => {
    const currentList = [...currentFolder[field]];
    const itemIds = items.map(item => item._id);
    const allSelected = itemIds.every(id => currentList.includes(id));

    let newList;
    if (allSelected) {
      newList = currentList.filter(id => !itemIds.includes(id));
    } else {
      newList = Array.from(new Set([...currentList, ...itemIds]));
    }
    setCurrentFolder({ ...currentFolder, [field]: newList });
  };

  const filteredQuizzes = quizzes.filter(q => q.title.toLowerCase().includes(searchTermQuizzes.toLowerCase()));
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTermStudents.toLowerCase()));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Folders</h1>
          <p className="text-slate-400">Organize quizzes and manage student access</p>
        </div>
        <CyanButton onClick={() => { setCurrentFolder({ name: '', description: '', quizzes: [], allowedUsers: [] }); setIsModalOpen(true); }} glow>
          <Plus className="w-4 h-4 mr-2" /> Create Folder
        </CyanButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map(folder => (
          <GlassCard key={folder._id} className="p-6 flex flex-col h-full" hover3d>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Folder className="text-cyan-400 w-6 h-6" />
              </div>
              <button onClick={() => { setCurrentFolder(folder); setIsModalOpen(true); }} className="text-slate-400 hover:text-white transition">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{folder.name}</h3>
            <p className="text-slate-400 text-sm mb-6 flex-1">{folder.description}</p>
            <div className="flex gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {folder.quizzes?.length || 0} Quizzes</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {folder.allowedUsers?.length || 0} Students</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{currentFolder._id ? 'Edit' : 'Create'} Folder</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
                placeholder="Folder Name"
                value={currentFolder.name}
                onChange={e => setCurrentFolder({...currentFolder, name: e.target.value})}
                required
              />
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
                placeholder="Description"
                value={currentFolder.description}
                onChange={e => setCurrentFolder({...currentFolder, description: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-400">Select Quizzes</label>
                    <button type="button" onClick={() => selectAll('quizzes', filteredQuizzes)} className="text-xs text-cyan-400 hover:underline">Toggle All</button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="🔍 Search quizzes by title..." 
                    className="w-full mb-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-400/50 transition-colors"
                    value={searchTermQuizzes}
                    onChange={e => setSearchTermQuizzes(e.target.value)}
                  />
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredQuizzes.map(q => (
                      <div 
                        key={q._id} 
                        onClick={() => toggleSelection(q._id, 'quizzes')}
                        className={`p-2 rounded-lg text-xs cursor-pointer border transition ${
                          currentFolder.quizzes.includes(q._id) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {q.title}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-400">Assign Students</label>
                    <button type="button" onClick={() => selectAll('allowedUsers', filteredStudents)} className="text-xs text-emerald-400 hover:underline">Toggle All</button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="🔍 Search students by name..." 
                    className="w-full mb-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-emerald-400/50 transition-colors"
                    value={searchTermStudents}
                    onChange={e => setSearchTermStudents(e.target.value)}
                  />
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredStudents.map(s => {
                      const isSelected = currentFolder.allowedUsers.includes(s._id);
                      return (
                        <div 
                          key={s._id} 
                          className={`p-2 rounded-lg text-xs border transition flex justify-between items-center ${
                            isSelected ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          <span>{s.name}</span>
                          <button 
                            type="button"
                            onClick={() => isSelected ? handleRemoveStudent(s._id) : toggleSelection(s._id, 'allowedUsers')}
                            className={`p-1 rounded-md transition ${isSelected ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-emerald-500/20 text-emerald-400'}`}
                            title={isSelected ? "Remove Student" : "Add Student"}
                          >
                            {isSelected ? <UserMinus size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <CyanButton type="submit" fullWidth glow>Save Folder Configuration</CyanButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherFolders;