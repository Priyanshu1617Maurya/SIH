import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import TrainCard from '../components/TrainCard';
import { useWebSocket } from '../hooks/useWebSocket';

const TrainSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('number');
  const [trainData, setTrainData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Connect to WebSocket for real-time updates
  const { messages, isConnected } = useWebSocket('ws://localhost:8000/ws/trains');

  useEffect(() => {
    // Update train data when WebSocket messages arrive
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'train_updates') {
        setTrainData(prev => {
          // Merge updates with existing data
          return prev.map(train => {
            const updatedTrain = lastMessage.trains.find(t => t.train_number === train.train_number);
            return updatedTrain || train;
          });
        });
      }
    }
  }, [messages]);

  // Live Train Tracker Component - YEH ADD KARO
  const LiveTrainTracker = ({ train }) => {
    const [liveData, setLiveData] = useState(train);

    useEffect(() => {
      // WebSocket se live updates
      const ws = new WebSocket('ws://localhost:8000/ws/trains');
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'live_updates') {
          const updatedTrain = data.trains.find(t => t.train_number === train.train_number);
          if (updatedTrain) setLiveData(updatedTrain);
        }
      };

      return () => ws.close();
    }, [train.train_number]);

    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
        <h3 className="text-lg font-semibold text-blue-800">Live Tracking: {liveData.train_name}</h3>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="font-medium ml-2">{liveData.current_status}</span>
          </div>
          <div>
            <span className="text-gray-600">Delay:</span>
            <span className="font-medium ml-2">{liveData.delay} minutes</span>
          </div>
          <div>
            <span className="text-gray-600">Speed:</span>
            <span className="font-medium ml-2">{liveData.speed} km/h</span>
          </div>
          <div>
            <span className="text-gray-600">Next Station:</span>
            <span className="font-medium ml-2">{liveData.next_station}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">ETA:</span>
            <span className="font-medium ml-2">{liveData.eta_next_station}</span>
          </div>
        </div>
      </div>
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/trains/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTrainData(data);
    } catch (err) {
      setError('Failed to fetch train data. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Train Search</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live updates connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="number">Train Number</option>
            <option value="name">Train Name</option>
            <option value="station">Station</option>
          </select>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchType === 'number' ? 'Enter train number' : 
              searchType === 'name' ? 'Enter train name' : 
              'Enter station code or name'
            }
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {trainData.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainData.map(train => (
              <div key={train.train_number}>
                <TrainCard train={train} />
                {/* YEH LINE ADD KARO Live Tracker ke liye */}
                <LiveTrainTracker train={train} />
              </div>
            ))}
          </div>
        </div>
      )}

      {trainData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow" style={{ height: '500px' }}>
          <h2 className="text-xl font-semibold mb-4">Live Location Map</h2>
          <MapView trainData={trainData} />
        </div>
      )}

      {trainData.length === 0 && !loading && (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-2">Search for Trains</h2>
          <p className="text-gray-600">
            Enter a train number, name, or station to find live train information.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Try searching for: 12345, 12839, 12259, or station codes like NDLS, CNB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainSearch;