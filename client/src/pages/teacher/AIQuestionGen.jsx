import React, { useState } from 'react';
import axios from 'axios';

const AIQuestionGen = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/generate-questions', {
        topic,
        numberOfQuestions: 5,
        difficulty: 'medium'
      });
      setQuestions(response.data.data);
    } catch (err) {
      alert('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">AI Question Generator</h1>
      <input
        type="text"
        placeholder="Enter topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button 
        onClick={generateQuestions}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Questions'}
      </button>
      
      {questions.map((q, idx) => (
        <div key={idx} className="border p-4 rounded mt-4">
          <p className="font-bold">{q.question}</p>
          {q.options?.map((opt, i) => (
            <p key={i} className="ml-4">{String.fromCharCode(65+i)}. {opt}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AIQuestionGen;
