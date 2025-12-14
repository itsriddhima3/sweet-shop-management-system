// frontend/src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Login = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { login, sendResetOtp, resetPassword } = useContext(AuthContext);
  
  const [step, setStep] = useState('login'); // 'login', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: ''
  });
  
  const [resetData, setResetData] = useState({
    userEmail: '',
    otp: '',
    newPassword: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.userEmail || !formData.userPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const loginData = { ...formData, userEmail: formData.userEmail.toLowerCase() };
      const response = await authAPI.login(loginData);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setStep('forgot');
    setError('');
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!resetData.userEmail) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    try {
      await sendResetOtp(resetData.userEmail.toLowerCase());
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!resetData.otp || !resetData.newPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const resetPayload = { ...resetData, userEmail: resetData.userEmail.toLowerCase() };
      await resetPassword(resetPayload);
      setError('Password reset successfully! Please login with your new password.');
      setStep('login');
      setResetData({ userEmail: '', otp: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleBackToLogin = () => {
    setStep('login');
    setError('');
    setResetData({ userEmail: '', otp: '', newPassword: '' });
  };

  return (
    <div className="space-y-5">
      {step === 'login' && (
        <>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="userEmail" className="block text-sm font-black text-gray-900 mb-2">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-150 text-gray-900"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="userPassword" className="block text-sm font-black text-gray-900 mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                id="userPassword"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-pink-400 transition duration-150 text-gray-900"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 border-2 border-black rounded focus:ring-orange-400"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-bold text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-black text-orange-600 hover:text-orange-700 underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border-4 border-black font-black text-lg rounded-xl text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-orange-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SIGNING IN...
                </>
              ) : (
                'LOGIN NOW 🚀'
              )}
            </button>
          </form>
        </>
      )}

      {step === 'forgot' && (
        <form onSubmit={handleSendOtp}>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="resetEmail" className="block text-sm font-black text-gray-900 mb-2">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              id="resetEmail"
              name="userEmail"
              value={resetData.userEmail}
              onChange={handleResetChange}
              className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-150 text-gray-900"
              placeholder="Enter your email to reset password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-6 border-4 border-black font-black text-lg rounded-xl text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-orange-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? 'SENDING...' : 'SEND RESET OTP'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="font-black text-orange-600 hover:text-orange-700 underline"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="otp" className="block text-sm font-black text-gray-900 mb-2">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={resetData.otp}
              onChange={handleResetChange}
              className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-150 text-gray-900"
              placeholder="Enter the OTP sent to your email"
              required
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-black text-gray-900 mb-2">
              NEW PASSWORD
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={resetData.newPassword}
              onChange={handleResetChange}
              className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-pink-400 transition duration-150 text-gray-900"
              placeholder="Enter your new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-6 border-4 border-black font-black text-lg rounded-xl text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-orange-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? 'RESETTING...' : 'RESET PASSWORD'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="font-black text-orange-600 hover:text-orange-700 underline"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;