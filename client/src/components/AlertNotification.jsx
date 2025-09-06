import React from 'react';

const AlertNotification = ({ alert, onAcknowledge }) => {
  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'high':
        return 'bg-orange-100 border-orange-400 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-700';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'delay':
        return '⏰';
      case 'congestion':
        return '🚦';
      case 'maintenance':
        return '🔧';
      case 'weather':
        return '🌧️';
      case 'safety':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`border rounded-lg p-3 min-w-64 ${getAlertColor(alert.severity)}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <span className="text-lg mr-2">{getAlertIcon(alert.type)}</span>
          <span className="font-semibold">{alert.title}</span>
        </div>
        <span className="text-xs opacity-70">
          {new Date(alert.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <p className="text-sm mb-3">{alert.message}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs opacity-70">
          Train: {alert.train_number}
        </span>
        <button
          onClick={() => onAcknowledge(alert.id)}
          className="text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default AlertNotification;