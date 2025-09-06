import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import AlertNotification from "../components/AlertNotification";

// Mock train data
const MOCK_TRAINS = [
  { train_number: "12345", train_name: "Rajdhani Express", lat: 20.5937, lng: 78.9629, speed: 80, delay: 0, current_status: "Running" },
  { train_number: "12839", train_name: "Howrah Rajdhani", lat: 21.1458, lng: 79.0882, speed: 75, delay: 0, current_status: "Running" },
  { train_number: "12259", train_name: "Sealdah Rajdhani", lat: 22.5726, lng: 88.3639, speed: 90, delay: 0, current_status: "Running" }
];

const Simulation = () => {
  const [scenario, setScenario] = useState("normal");
  const [isRunning, setIsRunning] = useState(false);
  const [trains, setTrains] = useState(MOCK_TRAINS);
  const [alerts, setAlerts] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // multiplier

  const scenarios = [
    { id: "normal", name: "Normal Operation", description: "Standard train operations with no disruptions" },
    { id: "delay", name: "Massive Delays", description: "Multiple train delays across the network" },
    { id: "weather", name: "Bad Weather", description: "Adverse weather conditions affecting operations" },
    { id: "breakdown", name: "Train Breakdown", description: "Simulate a train breakdown scenario" },
    { id: "congestion", name: "Network Congestion", description: "High traffic causing congestion at major stations" }
  ];

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTrains((prevTrains) => {
          return prevTrains.map((train) => {
            let newTrain = { ...train };

            // Random movement
            newTrain.lat += (Math.random() - 0.5) * 0.02 * simulationSpeed;
            newTrain.lng += (Math.random() - 0.5) * 0.02 * simulationSpeed;

            // Scenario effects
            switch (scenario) {
              case "normal":
                newTrain.delay = Math.max(0, newTrain.delay + (Math.random() < 0.1 ? 1 : 0));
                newTrain.current_status = "Running";
                break;
              case "delay":
                newTrain.delay += Math.floor(Math.random() * 5); // more frequent delays
                newTrain.current_status = newTrain.delay > 10 ? "Delayed" : "Running";
                break;
              case "weather":
                newTrain.delay += Math.floor(Math.random() * 3);
                newTrain.speed = Math.max(20, train.speed - Math.floor(Math.random() * 20));
                newTrain.current_status = newTrain.delay > 10 ? "Delayed" : "Running";
                break;
              case "breakdown":
                if (Math.random() < 0.05) newTrain.current_status = "Breakdown";
                break;
              case "congestion":
                newTrain.delay += Math.floor(Math.random() * 4);
                break;
              default:
                break;
            }

            // Generate alerts
            if (newTrain.delay > 10 || newTrain.current_status === "Breakdown") {
              setAlerts((prev) => {
                const alertExists = prev.find(a => a.train_number === newTrain.train_number);
                if (!alertExists) {
                  const newAlert = {
                    id: Date.now() + Math.random(),
                    train_number: newTrain.train_number,
                    message: `${newTrain.train_name} is ${newTrain.current_status} with ${newTrain.delay} min delay`
                  };
                  return [newAlert, ...prev.slice(0, 19)]; // max 20 alerts
                }
                return prev;
              });
            }

            return newTrain;
          });
        });
      }, 1000 / simulationSpeed);
    }

    return () => clearInterval(interval);
  }, [isRunning, scenario, simulationSpeed]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Simulation Mode</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Selection */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Select Scenario</h2>
          <div className="space-y-3">
            {scenarios.map((s) => (
              <div
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  scenario === s.id ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300"
                }`}
              >
                <h3 className="font-medium">{s.name}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Simulation Controls</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Simulation Speed</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              >
                <option value={1}>1x (Real-time)</option>
                <option value={2}>2x (Fast)</option>
                <option value={5}>5x (Very Fast)</option>
                <option value={10}>10x (Ultra Fast)</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Start
              </button>
              <button
                onClick={handleStop}
                disabled={!isRunning}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Live Train Map</h2>
        <MapView trainData={trains} zoom={5} />
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 rounded-lg shadow p-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Active Alerts</h2>
        <div className="space-y-2">
          {alerts.length === 0 && <p className="text-gray-600">No active alerts</p>}
          {alerts.map((alert) => (
            <AlertNotification key={alert.id} alert={alert} onAcknowledge={() => acknowledgeAlert(alert.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
