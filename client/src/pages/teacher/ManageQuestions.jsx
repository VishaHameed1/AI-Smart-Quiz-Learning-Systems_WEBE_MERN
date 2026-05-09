import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuestionForm from '../../components/forms/QuestionForm';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Remove the forward slash - use template literal or string with quotes
    axios.get(`/api/quizzes/${quizId}`)
      .then(res => {
        setQuestions(res.data.data.questions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [quizId]);

  const addQuestion = async (question) => {
    try {
      const response = await axios.post(`/api/questions/quiz/${quizId}/add`, question);
      setQuestions([...questions, response.data.data]);
    } catch (err) {
      alert('Failed to add question');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading questions...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Questions</h1>
      <QuestionForm onSubmit={addQuestion} />
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Question List ({questions.length})</h2>
        {questions.map((q, idx) => (
          <div key={idx} className="border p-4 rounded mb-2">
            <p className="font-bold">{idx + 1}. {q.text}</p>
            <p className="text-sm text-gray-500">Topic: {q.topic} | Difficulty: {q.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageQuestions;