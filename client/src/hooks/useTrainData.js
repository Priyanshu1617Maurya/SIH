import { useState } from 'react';

export const useTrainData = () => {
  const [trainData, setTrainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchTrains = async (query, type = 'number') => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8000/api/trains/search?q=${encodeURIComponent(query)}&type=${type}`);
      const data = await response.json();
      
      if (response.ok) {
        setTrainData(data);
      } else {
        setError(data.detail || 'Failed to fetch train data');
      }
    } catch{
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { searchTrains, trainData, loading, error };
};