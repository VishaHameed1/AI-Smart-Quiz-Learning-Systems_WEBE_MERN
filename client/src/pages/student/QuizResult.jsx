import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ScoreCard from '../../components/quiz/ScoreCard';
import ResultChart from '../../components/quiz/ResultChart';

const QuizResult = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // FIX: Added backticks and fixed the dynamic path for attemptId
    axios.get(`/api/attempts/${attemptId}/results`)
      .then(res => setResult(res.data.data))
      .catch(err => {
        console.error("Error fetching results:", err);
      });
  }, [attemptId]);

  if (!result) return <div className="text-center mt-10">Loading results...</div>;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="glass-panel p-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Quiz result</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            {result?.passed ? '🎉 Great job!' : '📚 Keep improving!'}
          </h1>
        </div>

        <ScoreCard
          score={result.score}
          total={result.questionsCount}
          percentage={result.percentageScore}
          passed={result.passed}
        />

        <div className="glass-panel p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Performance breakdown</h2>
          <ResultChart
            correct={result.score}
            incorrect={result.questionsCount - result.score}
          />
        </div>

        <div className="glass-panel p-6 text-center">
          <p className="text-slate-600 mb-4">Ready to try another quiz or review your answers?</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href="/quizzes" className="glass-button inline-flex items-center justify-center">
              Browse more quizzes
            </a>
            <a href="/progress" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-white">
              View progress
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;