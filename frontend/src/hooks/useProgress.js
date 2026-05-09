 import { useState, useEffect } from 'react';
import api from '../store/api';

const useProgress = (topic) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/progress/topic/${topic}`);
        setProgress(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (topic) fetchProgress();
  }, [topic]);
  
  return { progress, loading };
};

export default useProgress;
