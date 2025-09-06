import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : 'hover:bg-blue-700'
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">TM</span>
            </div>
            <h1 className="text-xl font-bold">TrackMitra</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            <Link 
              to="/search" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/search')}`}
            >
              Train Search
            </Link>
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')}`}
            >
              Controller
            </Link>
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin')}`}
            >
              Admin
            </Link>
            <Link 
              to="/simulation" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/simulation')}`}
            >
              Simulation
            </Link>
            <Link 
              to="/passenger" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/passenger')}`}
            >
              Passenger
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/search" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/search')}`}
            >
              Train Search
            </Link>
            <Link 
              to="/dashboard" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/dashboard')}`}
            >
              Controller
            </Link>
            <Link 
              to="/admin" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/admin')}`}
            >
              Admin
            </Link>
            <Link 
              to="/simulation" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/simulation')}`}
            >
              Simulation
            </Link>
            <Link 
              to="/passenger" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive('/passenger')}`}
            >
              Passenger
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar