import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

// ✅ Named export - CRITICAL
export const useProgress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchProgress();
    }
  }, [token]);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch progress');
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTopicProgress = async (topic, masteryScore, questionsAttempted, correctAnswers) => {
    try {
      const response = await axios.post('/api/progress/topic', 
        { topic, masteryScore, questionsAttempted, correctAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message };
    }
  };

  return { progress, loading, error, updateTopicProgress, refetch: fetchProgress };
};