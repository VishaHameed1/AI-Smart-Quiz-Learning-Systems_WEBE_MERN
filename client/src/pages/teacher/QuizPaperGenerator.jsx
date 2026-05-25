import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { FileText, Download, ArrowLeft } from 'lucide-react';

const QuizPaperGenerator = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paperInfo, setPaperInfo] = useState({
    universityName: '',
    departmentName: '',
    instructorName: '',
    courseName: '',
    semester: '',
    quizTitle: 'Quiz 1',
    totalMarks: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, qRes] = await Promise.all([
          api.get(`/quizzes/${quizId}`),
          api.get(`/questions/quiz/${quizId}`)
        ]);
        setQuiz(quizRes.data.data);
        setQuestions(qRes.data.data || []);
        // Auto-fill defaults from quiz data
        setPaperInfo(prev => ({
          ...prev,
          courseName: quizRes.data.data.title || '',
          totalMarks: qRes.data.data.reduce((sum, q) => sum + (q.points || 0), 0).toString() || '',
          duration: `${quizRes.data.data.duration} Minutes`
        }));
      } catch (error) {
        toast.error("Failed to load quiz data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [quizId]);

  const generatePaperPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    // 1. Header Section
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    const uniName = doc.splitTextToSize(paperInfo.universityName.toUpperCase(), contentWidth);
    doc.text(uniName, pageWidth / 2, y, { align: "center" });
    y += (uniName.length * 7);

    doc.setFontSize(12);
    const deptName = doc.splitTextToSize(paperInfo.departmentName, contentWidth);
    doc.text(deptName, pageWidth / 2, y, { align: "center" });
    y += (deptName.length * 6) + 5;

    // Info Row 1
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    doc.text(`Course: ${paperInfo.courseName}`, margin, y);
    doc.text(`Instructor: ${paperInfo.instructorName}`, pageWidth - margin, y, { align: "right" });
    y += 6;

    // Info Row 2
    doc.text(`Semester: ${paperInfo.semester}`, margin, y);
    doc.text(`Total Marks: ${paperInfo.totalMarks}`, pageWidth - margin, y, { align: "right" });
    y += 10;

    // Quiz Title
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(paperInfo.quizTitle.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 3;
    doc.line(margin, y, pageWidth - margin, y); // Horizontal border
    y += 10;

    // 2. Student Info Section
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(`Student Name: _______________________`, margin, y);
    doc.text(`Roll Number: _______________________`, pageWidth - margin, y, { align: "right" });
    y += 8;
    doc.text(`Section: ____________________________`, margin, y);
    doc.text(`Signature: __________________________`, pageWidth - margin, y, { align: "right" });
    y += 8;
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // 3. Instructions
    doc.setFont("times", "bold");
    doc.text("Instructions:", margin, y);
    y += 6;
    doc.setFont("times", "normal");
    const instructions = [
      "1. Attempt all questions.",
      "2. Write answers clearly and legibly.",
      "3. Use of unfair means or electronic gadgets is strictly prohibited.",
      `- Time Duration: ${paperInfo.duration}`
    ];
    instructions.forEach(inst => {
      doc.text(inst, margin + 5, y);
      y += 5;
    });
    y += 10;

    // 4. Questions Section
    questions.forEach((q, index) => {
      const qLabel = `Q${index + 1}: `;
      const qText = q.text || q.question;
      const points = `[${q.points || 0}]`;
      const qTextWidth = contentWidth - 25;
      const splitText = doc.splitTextToSize(qText, qTextWidth);

      // Estimate required space for this question block
      const qHeight = (splitText.length * 6) + 
                     (q.type === 'mcq' ? (q.options.length * 6) : 
                     (q.type === 'theoretical' ? 45 : 0)) + 10;
      
      // Check page overflow
      if (y + qHeight > 280) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("times", "bold");
      doc.text(qLabel, margin, y);
      doc.text(splitText, margin + 10, y);
      doc.text(points, pageWidth - margin, y, { align: "right" });
      
      y += (splitText.length * 6) + 4;

      if (q.type === 'mcq' && q.options) {
        doc.setFont("times", "normal");
        q.options.forEach((opt, optIdx) => {
          const optLabel = `${String.fromCharCode(97 + optIdx)}) `;
          const optSplit = doc.splitTextToSize(opt, qTextWidth - 5);
          doc.text(optLabel, margin + 15, y);
          doc.text(optSplit, margin + 22, y);
          y += (optSplit.length * 6);
        });
      } else if (q.type === 'theoretical') {
        // Add visual space for answer
        y += 2;
        doc.setDrawColor(180);
        doc.rect(margin + 10, y, contentWidth - 10, 35); 
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Write your answer here (Max 100 words)", margin + 12, y + 4);
        doc.setTextColor(0);
        doc.setFontSize(10);
        y += 40;
      }
      y += 6;
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 287, { align: "center" });
      doc.text(`Exam Date: ${paperInfo.date}`, margin, 287);
    }

    doc.save(`${paperInfo.courseName}_${paperInfo.quizTitle}.pdf`);
    toast.success("Professional Paper Generated!");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#030712] p-8 text-white">
      <div className="max-w-4xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 mb-6 transition">
          <ArrowLeft size={20} /> Back to Management
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">University Paper Generator</h1>
            <p className="text-slate-400">Transform your digital quiz into a professional printed examination paper</p>
          </div>
        </div>

        <GlassCard className="p-8" glowLine>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.keys(paperInfo).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-400 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type={key === 'date' ? 'date' : 'text'}
                  value={paperInfo[key]}
                  onChange={(e) => setPaperInfo({ ...paperInfo, [key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                  placeholder={`Enter ${key}...`}
                />
              </div>
            ))}
          </div>

          <CyanButton onClick={generatePaperPDF} fullWidth glow icon={<Download size={20} />}>
            Generate & Download Exam Paper
          </CyanButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default QuizPaperGenerator;