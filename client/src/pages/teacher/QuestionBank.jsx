import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (topic && token) {
      const fetchQuestions = async () => {
        setLoading(true);
        try {
          // ✅ FIXED: Use BACKTICKS, not forward slashes
          const url = `/api/questions/topic/${topic}`;
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setQuestions(response.data.data || []);
        } catch (error) {
          console.error('Error fetching questions:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [topic, token]);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Question Bank</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Search by Topic</label>
        <input
          type="text"
          placeholder="Enter topic name..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q._id} className="border rounded-lg p-4 bg-white">
            <div className="font-medium">{idx + 1}. {q.text}</div>
            <div className="text-sm text-gray-500 mt-2">
              Topic: {q.topic} | Difficulty: {q.difficulty}
            </div>
          </div>
        ))}
      </div>
      {questions.length === 0 && topic && !loading && (
        <div className="text-center py-8 text-gray-500">No questions found for "{topic}"</div>
      )}
    </div>
  );
};

export default QuestionBank;