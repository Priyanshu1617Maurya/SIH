import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-white/10 backdrop-blur-lg text-white h-screen p-6 flex flex-col border-r border-white/20">
      <h1 className="text-3xl font-bold mb-8">TrackMitra</h1>
      <nav className="flex flex-col gap-4 text-lg">
        <Link to="/controller" className="hover:text-yellow-400 transition">Dashboard</Link>
        <Link to="/simulation" className="hover:text-yellow-400 transition">Simulation</Link>
        <Link to="/admin" className="hover:text-yellow-400 transition">Admin</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
