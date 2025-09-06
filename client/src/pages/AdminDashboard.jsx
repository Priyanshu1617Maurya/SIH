import React, { useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket"; // tumhare ControllerDashboard hook jaise

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [trains, setTrains] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTrains: 0,
    totalAlerts: 0,
    systemStatus: "Online",
  });
  const [searchUser, setSearchUser] = useState("");
  const [searchTrain, setSearchTrain] = useState("");

  // ✅ WebSocket connection
  const { messages, isConnected } = useWebSocket(
    "ws://localhost:8000/ws/admin"
  );

  // Initial data (mock)
  useEffect(() => {
    setUsers([
      { id: 1, name: "Admin User", email: "admin@trackmitra.com", role: "Administrator", status: "Active" },
      { id: 2, name: "Controller 1", email: "controller1@trackmitra.com", role: "Controller", status: "Active" },
      { id: 3, name: "Controller 2", email: "controller2@trackmitra.com", role: "Controller", status: "Inactive" }
    ]);

    setTrains([
      { id: 1, number: "12345", name: "Rajdhani Express", status: "Running", delay: 15 },
      { id: 2, number: "12839", name: "Howrah Rajdhani", status: "Delayed", delay: 30 },
      { id: 3, number: "12259", name: "Sealdah Rajdhani", status: "On Time", delay: 0 }
    ]);

    setStats({
      totalUsers: 3,
      activeTrains: 3,
      totalAlerts: 0,
      systemStatus: "Online"
    });
  }, []);

  // ✅ Handle WebSocket messages
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.type === "user_update") {
        setUsers(msg.users);
        setStats((prev) => ({ ...prev, totalUsers: msg.users.length }));
      } else if (msg.type === "train_update") {
        setTrains(msg.trains);
        setStats((prev) => ({ ...prev, activeTrains: msg.trains.length }));
      } else if (msg.type === "system_status") {
        setStats((prev) => ({ ...prev, systemStatus: msg.status }));
      }
    });
  }, [messages]);

  // Filters
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredTrains = trains.filter(
    (train) =>
      train.number.includes(searchTrain) ||
      train.name.toLowerCase().includes(searchTrain.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <input
                type="text"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="p-2 border rounded text-sm"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "trains":
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Train Management</h3>
              <input
                type="text"
                placeholder="Search trains..."
                value={searchTrain}
                onChange={(e) => setSearchTrain(e.target.value)}
                className="p-2 border rounded text-sm"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Train Number</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Delay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTrains.map((train) => (
                    <tr key={train.id}>
                      <td className="px-6 py-4">{train.number}</td>
                      <td className="px-6 py-4">{train.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            train.status === "Running"
                              ? "bg-green-100 text-green-800"
                              : train.status === "Delayed"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {train.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{train.delay} min</td>
                    </tr>
                  ))}
                  {filteredTrains.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No trains found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">System Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm text-blue-800">Total Users</h4>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm text-green-800">Active Trains</h4>
                <p className="text-2xl font-bold text-green-600">{stats.activeTrains}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-sm text-yellow-800">Total Alerts</h4>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalAlerts}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm text-purple-800">System Status</h4>
                <p className="text-2xl font-bold text-purple-600">{stats.systemStatus}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b">
          <nav className="flex -mb-px">
            {["users", "trains", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Connection Status */}
      <div className="mt-4 text-sm text-gray-600">
        WebSocket:{" "}
        <span className={isConnected ? "text-green-600" : "text-red-600"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </div>
  );
};

export default AdminDashboard;
