// frontend/src/pages/AuthPage.jsx
import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-orange-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-black rounded-2xl p-4 mb-6 transform hover:scale-110 transition-all duration-300 border-4 border-pink-500 shadow-2xl">
              <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-white mb-3 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-tight">
              SWEET SHOP
            </h1>
            <p className="text-xl font-bold text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)]">
              Join the Sweetest Community! 🍬
            </p>
          </div>

          {/* Tab Selector */}
          <div className="bg-black rounded-t-2xl p-2 flex space-x-2 border-4 border-b-0 border-black">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all duration-300 border-2 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-white transform scale-105 shadow-lg'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all duration-300 border-2 ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white border-white transform scale-105 shadow-lg'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-b-2xl shadow-2xl border-4 border-t-0 border-black overflow-hidden">
            <div className="p-8">
              {activeTab === 'login' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                      Welcome Back! 👋
                    </h2>
                    <p className="text-gray-600 font-semibold">
                      Sign in to continue your sweet journey
                    </p>
                  </div>
                  <Login embedded={true} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                      Create Account 🎉
                    </h2>
                    <p className="text-gray-600 font-semibold">
                      Join thousands of sweet lovers worldwide!
                    </p>
                  </div>
                  <Register embedded={true} />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-orange-100 via-pink-100 to-orange-100 px-8 py-4 border-t-4 border-black">
              <p className="text-center text-sm font-bold text-gray-700">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setActiveTab('register')}
                      className="text-pink-600 hover:text-pink-700 font-black underline"
                    >
                      Register now!
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-orange-600 hover:text-orange-700 font-black underline"
                    >
                      Login here!
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-pink-400">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-xs font-black text-white">Secure</p>
            </div>
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-orange-400">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-xs font-black text-white">Fast</p>
            </div>
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 text-center border-2 border-pink-400">
              <div className="text-3xl mb-2">🎁</div>
              <p className="text-xs font-black text-white">Rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;