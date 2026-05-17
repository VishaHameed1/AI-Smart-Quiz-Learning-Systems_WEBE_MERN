import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TakeQuiz = () => {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/quizzes/${quizId}`);
        const quizData = res.data.data;
        setQuiz(quizData);
        setQuestions(quizData.questions || []);
      } catch (err) {
        console.error('Error loading quiz:', err);
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [quizId, navigate]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const q = questions[currentIndex];
      const limit = q.timeLimit || 60;
      setTimeLeft(limit);
      setQuestionStart(Date.now());
      setSelectedAnswer(null);
    }
  }, [questions, currentIndex]);

  useEffect(() => {
    if (!questions.length || currentIndex >= questions.length) return;
    
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleAnswer(null, true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [questions, currentIndex]);

  const handleAnswer = async (answer, timedOut = false) => {
    if (submitting) return;
    
    const questionId = questions[currentIndex]._id;
    const currentQuestion = questions[currentIndex];
    const limit = currentQuestion.timeLimit || 60;
    const elapsed = Math.round((Date.now() - questionStart) / 1000);
    const timeTaken = timedOut ? limit : Math.min(elapsed, limit);

    setSubmitting(true);

    try {
      await api.post(`/attempts/${attemptId}/submit-answer`, {
        questionId,
        selectedAnswer: answer,
        timeTaken,
      });

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        await api.post(`/attempts/${attemptId}/complete`);
        navigate(`/quiz/result/${attemptId}`);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <GlassCard className="text-center p-8">
          <p className="text-slate-400">No questions found for this quiz.</p>
          <CyanButton onClick={() => navigate('/quizzes')} className="mt-4">
            Back to Quizzes
          </CyanButton>
        </GlassCard>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">{quiz?.title || 'Quiz'}</h1>
            <div className="glass-card px-4 py-2 rounded-full">
              <span className={`font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Progress</span>
              <span>{currentIndex + 1} / {questions.length}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <GlassCard className="p-8" glowLine>
          <div className="mb-6">
            <span className="text-sm text-cyan-400 uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <h2 className="text-2xl font-bold text-white mt-2">{currentQuestion.text}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !submitting && setSelectedAnswer(option)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  selectedAnswer === option
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 text-white'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
                disabled={submitting}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-white/10 text-center mr-3 text-sm">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <CyanButton
              onClick={() => handleAnswer(selectedAnswer)}
              disabled={!selectedAnswer || submitting}
              size="lg"
              glow
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : currentIndex + 1 === questions.length ? (
                'Submit Quiz'
              ) : (
                'Next Question →'
              )}
            </CyanButton>
          </div>
        </GlassCard>

        {/* Question Navigator */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-10 h-10 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-cyan-500 text-white'
                  : idx < currentIndex
                  ? 'bg-emerald-500/50 text-white'
                  : 'bg-white/10 text-slate-400 hover:bg-white/20'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;