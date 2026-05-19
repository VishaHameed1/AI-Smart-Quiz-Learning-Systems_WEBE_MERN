import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import GlassCard from '../../components/common/GlassCard';
import CyanButton from '../../components/common/CyanButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const QuizResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/attempts/${attemptId}/results`);
        setResult(res.data.data);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [attemptId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <GlassCard className="text-center p-8">
          <p className="text-slate-400">Results not found.</p>
          <CyanButton onClick={() => navigate('/quizzes')} className="mt-4">
            Back to Quizzes
          </CyanButton>
        </GlassCard>
      </div>
    );
  }

  const percentage = result.percentageScore || 0;
  const isPassed = result.passed || percentage >= 60;
  const totalQuestions = result.totalQuestions || result.detailedResults?.length || 0;
  const correctAnswers = result.score || 0;
  const incorrectAnswers = totalQuestions - correctAnswers;

  return (
    <div className="min-h-screen bg-[#030712] p-6">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cpath fill=\'rgba(255,255,255,0.02)\' d=\'M0 0h40v40H0z\'/%3E%3C/svg%3E')] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-8">Quiz Results</h1>

        {/* Score Card */}
        <GlassCard className="text-center p-8 mb-6" glowLine>
          <div className="relative inline-block mx-auto mb-6">
            <div className="w-40 h-40 rounded-full border-8 border-white/10 flex items-center justify-center">
              <div>
                <span className="text-5xl font-bold text-white">{Math.round(percentage)}</span>
                <span className="text-2xl text-slate-400">%</span>
              </div>
            </div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-cyan-400"
              style={{ 
                clipPath: `polygon(0 0, 1px 0, 1px 1px, 0 1px)`,
                borderColor: isPassed ? '#00f2ff' : '#ef4444'
              }}
            />
          </div>
          
          <h2 className={`text-2xl font-bold mb-2 ${isPassed ? 'text-cyan-400' : 'text-red-400'}`}>
            {isPassed ? '🎉 Congratulations! You Passed!' : '😢 Keep Practicing!'}
          </h2>
          <p className="text-slate-400 mb-4">
            You scored {correctAnswers} out of {totalQuestions} questions correctly
          </p>
          
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{correctAnswers}</div>
              <div className="text-sm text-slate-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{incorrectAnswers}</div>
              <div className="text-sm text-slate-500">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{result.earnedPoints || 0}</div>
              <div className="text-sm text-slate-500">XP Earned</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <CyanButton onClick={() => navigate('/quizzes')} size="sm">
              Try Another Quiz
            </CyanButton>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </GlassCard>

        {/* Question-wise Breakdown */}
        {result.detailedResults && result.detailedResults.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Question Breakdown</h3>
            <div className="space-y-4">
              {result.detailedResults.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {item.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.questionText || item.questionId}</p>
                      {!item.isCorrect && item.correctAnswer && (
                        <p className="text-sm text-slate-400 mt-1">
                          Correct answer: <span className="text-cyan-400">{item.correctAnswer}</span>
                        </p>
                      )}
                      {item.explanation && (
                        <p className="text-sm text-slate-500 mt-2">{item.explanation}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.pointsEarned || 0} pts
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Topic Mastery */}
        {result.topicMastery && Object.keys(result.topicMastery).length > 0 && (
          <GlassCard className="p-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Topic Mastery</h3>
            <div className="space-y-3">
              {Object.entries(result.topicMastery).map(([topic, score]) => (
                <div key={topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{topic}</span>
                    <span className="text-cyan-400">{Math.round(score)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: `${score}%` }} />
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

export default QuizResult;