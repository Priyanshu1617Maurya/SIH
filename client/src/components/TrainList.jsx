import React from 'react';

const TrainList = ({ trains, selectedTrain, onTrainSelect }) => {
  if (trains.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-gray-500 text-center">No trains found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {trains.map(train => (
        <div
          key={train.train_number}
          className={`p-4 border-b cursor-pointer transition-colors ${
            selectedTrain?.train_number === train.train_number
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => onTrainSelect(train)}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-gray-800">{train.train_number}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              train.delay > 15 ? 'bg-red-100 text-red-800' : 
              train.delay > 5 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {train.delay || 0}m
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-1">{train.train_name}</p>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{train.current_station} → {train.destination_station}</span>
            <span>{train.speed} km/h</span>
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            Next: {train.next_station} at {train.eta_next_station}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainList;