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
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Quiz Result</h1>
      <ScoreCard 
        score={result.score}
        total={result.questionsCount}
        percentage={result.percentageScore}
        passed={result.passed}
      />
      <div className="mt-8">
        <ResultChart 
          correct={result.score}
          incorrect={result.questionsCount - result.score}
        />
      </div>
    </div>
  );
};

export default QuizResult;