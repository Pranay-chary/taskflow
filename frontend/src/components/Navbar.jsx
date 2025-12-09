import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">📋 TaskFlow</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="text-white">
              <NotificationBell userId={user.id} />
            </div>

            <div className="text-sm">
              <span className="font-semibold">{user.name}</span>
              <span className="ml-2 bg-blue-700 px-2 py-1 rounded text-xs">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
