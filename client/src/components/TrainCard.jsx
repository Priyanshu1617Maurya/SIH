import React from 'react'

const TrainCard = ({ train }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-blue-600">{train.train_number}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          train.delay > 15 ? 'bg-red-100 text-red-800' : 
          train.delay > 5 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {train.delay || 0}m delay
        </span>
      </div>
      
      <h4 className="text-md font-medium mb-2">{train.train_name}</h4>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-600">From:</span>
          <p className="font-medium">{train.current_station}</p>
        </div>
        <div>
          <span className="text-gray-600">To:</span>
          <p className="font-medium">{train.destination_station}</p>
        </div>
        <div>
          <span className="text-gray-600">Status:</span>
          <p className="font-medium">{train.current_status}</p>
        </div>
        <div>
          <span className="text-gray-600">Speed:</span>
          <p className="font-medium">{train.speed} km/h</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <p className="text-sm text-gray-600">
          Next: {train.next_station} at {train.eta_next_station}
        </p>
      </div>
    </div>
  )
}

export default TrainCard