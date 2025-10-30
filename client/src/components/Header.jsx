// client/src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth(); 
  
  const isLoggedIn = isAuthenticated;
  const username = user?.username || 'User';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Site Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-wider">
              DevScribe
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 transition duration-150 font-medium"
            >
                Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link 
                    to="/create-post" 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-150 font-medium"
                >
                    Create Post
                </Link>
                <span className="text-gray-700 font-medium hidden sm:inline">
                    Hello, <strong>{username}</strong>
                </span>
                <button 
                    onClick={logout} 
                    className="text-red-500 hover:text-red-700 transition duration-150 font-medium"
                >
                    Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-800 transition duration-150 font-medium"
                >
                    Login
                </Link>
                <Link 
                    to="/register" 
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-150 font-medium"
                >
                    Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}