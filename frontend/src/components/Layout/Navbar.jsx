// frontend/src/components/Layout/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 shadow-2xl sticky top-0 z-50 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-black rounded-xl p-3 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight leading-none">
                  Sweet Shop
                </span>
                <span className="text-xs font-bold text-black tracking-wider">
                  PREMIUM CANDY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Browse Sweets Button */}
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="flex items-center space-x-2 bg-black text-orange-400 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-900 transform transition-all duration-200 hover:scale-105 border-2 border-orange-400 hover:border-pink-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Browse Sweets</span>
            </Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-pink-700 transform transition-all duration-200 hover:scale-105 border-2 border-black"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 bg-white text-black px-5 py-3 rounded-lg font-bold text-sm hover:bg-gray-100 transform transition-all duration-200 border-2 border-black"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black border-2 border-black">
                      {user.userName?.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.userName}</span>
                    <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-4 border-black overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-orange-400 to-pink-400 border-b-2 border-black">
                        <p className="text-sm font-black text-black">{user.userName}</p>
                        <p className="text-xs text-gray-800">{user.userEmail}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-black text-white bg-black rounded-full">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-sm font-bold text-gray-900 hover:bg-orange-100 transition duration-150 border-b border-gray-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        🍬 My Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition duration-150"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-black text-white px-8 py-3 rounded-lg font-black text-sm hover:bg-gray-900 transform transition-all duration-200 hover:scale-105 border-2 border-pink-500 hover:border-orange-500 shadow-lg"
              >
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-black/20 focus:outline-none transition duration-150 border-2 border-black bg-black/10"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-gradient-to-b from-pink-500 to-orange-500">
          <div className="px-2 pt-2 pb-3 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-3 bg-black/20 rounded-lg border-2 border-black mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-xl border-2 border-black">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{user.username}</p>
                      <p className="text-xs text-black">{user.email}</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="block px-4 py-3 rounded-lg font-bold text-white bg-black hover:bg-gray-900 transition duration-150 border-2 border-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🍬 Browse Sweets
                </Link>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 rounded-lg font-bold text-white bg-pink-600 hover:bg-pink-700 transition duration-150 border-2 border-black"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition duration-150 border-2 border-black"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="block px-4 py-3 rounded-lg font-bold text-white bg-black hover:bg-gray-900 transition duration-150 border-2 border-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🍬 Browse Sweets
                </Link>
                <Link
                  to="/auth"
                  className="block px-4 py-3 rounded-lg font-black text-white bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 transition duration-150 border-2 border-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LOGIN / REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;