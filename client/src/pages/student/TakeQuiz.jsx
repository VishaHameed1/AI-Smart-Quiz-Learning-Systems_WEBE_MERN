import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuestionCard from '../../components/quiz/QuestionCard';
import ProgressBar from '../../components/quiz/ProgressBar';
import Timer from '../../components/quiz/Timer';

const TakeQuiz = () => {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // FIX 1: Added backticks and dynamic quizId
    axios.get(`/api/quizzes/${quizId}`)
      .then(res => setQuestions(res.data.data.questions))
      .catch(err => console.error("Error loading quiz:", err));
  }, [quizId]);

  const handleAnswer = async (answer) => {
    // Store current answer with question ID
    const currentAnswer = {
      questionId: questions[currentIndex]._id,
      selectedOption: answer
    };
    
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        // FIX 2: Added backticks, attemptId, and sending answers in body
        await axios.post(`/api/attempts/${attemptId}/complete`, { answers: newAnswers });
        
        // FIX 3: Redirect to results using the attemptId
        navigate(`/quiz/result/${attemptId}`);
      } catch (err) {
        console.error("Error completing quiz:", err);
        alert("Failed to submit quiz results.");
      }
    }
  };

  if (!questions || !questions.length) return <div className="text-center mt-10">Loading questions...</div>;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="glass-panel p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950">Taking Quiz</h1>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-sky-500 to-violet-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionCard
          question={questions[currentIndex]}
          onSubmit={handleAnswer}
          currentNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />
      </div>
    </div>
  );
};

export default TakeQuiz;