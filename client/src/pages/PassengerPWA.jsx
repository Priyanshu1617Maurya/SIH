import React, { useState } from 'react';

const PassengerPWA = () => {
  const [searchType, setSearchType] = useState('number');
  const [searchQuery, setSearchQuery] = useState('');

  const popularTrains = [
    { number: '12345', name: 'Rajdhani Express', time: '14:30', status: 'On Time' },
    { number: '12839', name: 'Howrah Rajdhani', time: '15:45', status: 'Delayed 15m' },
    { number: '12259', name: 'Sealdah Rajdhani', time: '16:20', status: 'On Time' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality would go here
    alert(`Searching for ${searchQuery} (${searchType})`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Passenger Information</h1>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Find Your Train</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="number">Train Number</option>
              <option value="name">Train Name</option>
              <option value="station">Station</option>
            </select>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'number' ? 'Enter train number' :
                searchType === 'name' ? 'Enter train name' :
                'Enter station name'
              }
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Popular Trains */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Popular Trains</h2>
        <div className="space-y-3">
          {popularTrains.map(train => (
            <div key={train.number} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">{train.number} - {train.name}</h3>
                <p className="text-sm text-gray-600">Departure: {train.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                train.status.includes('On Time') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {train.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Updates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Live Updates</h2>
        <p className="text-gray-600">
          Real-time train information, platform details, and live status updates will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default PassengerPWA;