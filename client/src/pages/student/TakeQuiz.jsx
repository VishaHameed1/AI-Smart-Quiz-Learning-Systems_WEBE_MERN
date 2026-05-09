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
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded shadow-sm">
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        {/* Timer component can be added here if needed */}
      </div>

      <QuestionCard 
        question={questions[currentIndex]}
        onSubmit={handleAnswer}
        currentNumber={currentIndex + 1}
        totalQuestions={questions.length}
      />
      
      <div className="mt-4 text-center text-gray-500">
        Question {currentIndex + 1} of {questions.length}
      </div>
    </div>
  );
};

export default TakeQuiz;