import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            404
          </div>
          <div className="text-6xl mb-4">🍬</div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Sweet Not Found!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for has melted away like a popsicle on a hot summer day.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            Go to Home
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            Browse Sweets
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lost your way? Here are some helpful links:
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link to="/" className="text-purple-600 hover:text-purple-700 font-medium">
              Home
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/dashboard" className="text-purple-600 hover:text-purple-700 font-medium">
              Dashboard
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Login
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;