// src/pages/ControllerDashboard.jsx
import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import AlertNotification from "../components/AlertNotification";
import TrainList from "../components/TrainList";
import ControlPanel from "../components/ControlPanel";
import { useWebSocket } from "../hooks/useWebSocket";

const ControllerDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [filter, setFilter] = useState("all"); // all | delayed | on-time
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ WebSocket connection
  const { messages, isConnected } = useWebSocket(
    "ws://localhost:8000/ws/trains"
  );

  // ✅ Initial train data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // ✅ Handle WebSocket messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "train_updates") {
        setTrains(lastMessage.trains);
      } else if (lastMessage.type === "alert") {
        handleNewAlert(lastMessage.alert);
      }
    }
  }, [messages]);

  const fetchInitialData = async () => {
    try {
      const response = await fetch("/api/trains/all");
      if (response.ok) {
        const data = await response.json();
        setTrains(data);
      }
    } catch (error) {
      console.error("❌ Error fetching initial trains:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAlert = (alert) => {
    setAlerts((prev) => [alert, ...prev.slice(0, 19)]); // max 20 alerts
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: "POST",
      });

      if (response.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      }
    } catch {
      alert("❌ Failed to acknowledge alert.");
    }
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
  };

  // ✅ Filtering + Search
  const filteredTrains = trains.filter((train) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "delayed" && train.delay > 5) ||
      (filter === "on-time" && train.delay <= 5);

    const matchesSearch =
      searchTerm === "" ||
      train.train_number.includes(searchTerm) ||
      train.train_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Active Trains</h2>

          {/* Search & Filter */}
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Search trains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex space-x-2">
              {["all", "on-time", "delayed"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`flex-1 p-2 rounded text-sm ${
                    filter === type
                      ? type === "all"
                        ? "bg-blue-600 text-white"
                        : type === "on-time"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {type === "all"
                    ? "All"
                    : type === "on-time"
                    ? "On Time"
                    : "Delayed"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Train List */}
        {loading ? (
          <div className="p-4 text-gray-500">Loading trains...</div>
        ) : (
          <TrainList
            trains={filteredTrains}
            selectedTrain={selectedTrain}
            onTrainSelect={handleTrainSelect}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Controller Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? "Live Connected" : "Disconnected"}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {trains.length} trains monitoring
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-yellow-50 border-b border-yellow-200 p-2">
          <h3 className="font-semibold text-yellow-800 mb-2">Active Alerts</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {alerts.slice(0, 5).map((alert) => (
              <AlertNotification
                key={alert.id}
                alert={alert}
                onAcknowledge={acknowledgeAlert}
              />
            ))}
            {alerts.length === 0 && (
              <div className="text-sm text-yellow-600">No active alerts</div>
            )}
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Live Train Locations</h2>
            </div>
            <div className="h-[400px]">
              <MapView
                trainData={selectedTrain ? [selectedTrain] : trains}
                zoom={selectedTrain ? 12 : 6}
              />
            </div>
          </div>

          {/* Train Details + Controls */}
          <div className="space-y-4">
            {selectedTrain ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-semibold mb-4">Train Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Info label="Train Number" value={selectedTrain.train_number} />
                    <Info label="Train Name" value={selectedTrain.train_name} />
                    <Info label="Current Speed" value={`${selectedTrain.speed} km/h`} />
                    <Info
                      label="Delay"
                      value={`${selectedTrain.delay} minutes`}
                      className={
                        selectedTrain.delay > 15
                          ? "text-red-600"
                          : selectedTrain.delay > 5
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    />
                    <Info label="Next Station" value={selectedTrain.next_station} />
                    <Info label="ETA" value={selectedTrain.eta_next_station} />
                    <Info
                      label="Status"
                      value={selectedTrain.current_status}
                      full
                    />
                  </div>
                </div>

                <ControlPanel train={selectedTrain} />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-lg font-semibold mb-2">Select a Train</h2>
                <p className="text-gray-600">
                  Click on a train from the list to view details and controls
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t p-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Last update: {new Date().toLocaleTimeString()}</span>
            <span>System: {isConnected ? "Operational" : "Disconnected"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small info component for details card
const Info = ({ label, value, className = "", full = false }) => (
  <div className={full ? "col-span-2" : ""}>
    <label className="text-sm text-gray-500">{label}</label>
    <p className={`font-medium ${className}`}>{value || "N/A"}</p>
  </div>
);

export default ControllerDashboard;
