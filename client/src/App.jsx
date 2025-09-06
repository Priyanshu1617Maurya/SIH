import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TrainSearch from "./pages/TrainSearch";
import ControllerDashboard from "./pages/ControllerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Simulation from "./pages/Simulation";
import PassengerPWA from "./pages/PassengerPWA";
import Login from "./pages/Login";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Top Navigation */}
        <Navbar />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<TrainSearch />} />
          <Route path="/search" element={<TrainSearch />} />
          <Route path="/dashboard" element={<ControllerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/passenger" element={<PassengerPWA />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
