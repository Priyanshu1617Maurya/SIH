import React, { useState } from 'react';

const ControlPanel = ({ train }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendCommand = async (command, data = {}) => {
    setIsSending(true);
    try {
      const response = await fetch('/api/control/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          train_number: train.train_number,
          command,
          ...data
        }),
      });

      if (response.ok) {
        setMessage('Command sent successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to send command');
      }
    } catch (error) {
      setMessage('Error sending command');
      console.error('Error sending command:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSpeedAdjustment = (action) => {
    const adjustments = {
      increase: Math.min(train.speed + 10, 100),
      decrease: Math.max(train.speed - 10, 20)
    };
    sendCommand('adjust_speed', { speed: adjustments[action] });
  };

  const handleReroute = () => {
    sendCommand('suggest_reroute');
  };

  const handlePriority = () => {
    sendCommand('request_priority');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Control Panel</h2>
      
      {message && (
        <div className={`p-2 mb-4 rounded text-sm ${
          message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-3">
        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Speed Control</label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleSpeedAdjustment('decrease')}
              disabled={isSending}
              className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:bg-red-300"
            >
              Decrease Speed
            </button>
            <button
              onClick={() => handleSpeedAdjustment('increase')}
              disabled={isSending}
              className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-green-300"
            >
              Increase Speed
            </button>
          </div>
        </div>

        {/* Reroute Suggestion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Route Management</label>
          <button
            onClick={handleReroute}
            disabled={isSending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            Suggest Alternative Route
          </button>
        </div>

        {/* Priority Request */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <button
            onClick={handlePriority}
            disabled={isSending}
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:bg-purple-300"
          >
            Request Priority Clearance
          </button>
        </div>

        {/* Emergency Controls */}
        <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-red-700 mb-2">Emergency Controls</label>
          <button
            onClick={() => sendCommand('emergency_stop')}
            disabled={isSending}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:bg-red-300"
          >
            Emergency Stop
          </button>
        </div>

        {/* AI Recommendations */}
        <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">AI Recommendations</label>
          <button
            onClick={() => sendCommand('get_ai_recommendation')}
            disabled={isSending}
            className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 disabled:bg-gray-300"
          >
            Get AI Optimization
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;