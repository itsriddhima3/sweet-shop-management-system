// frontend/src/components/Auth/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Register = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    password: '',
    confirmPassword: ''
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

  const validateForm = () => {
    if (!formData.userName || !formData.userEmail || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.userName.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.userEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, password: userPassword, ...registerData } = formData;
      const registerPayload = { ...registerData, userPassword, userEmail: registerData.userEmail.toLowerCase() };
      const response = await authAPI.register(registerPayload);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
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
        <label htmlFor="username" className="block text-sm font-black text-gray-900 mb-2">
          USERNAME
        </label>
        <input
          id="username"
          name="userName"
          type="text"
          autoComplete="username"
          required
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-pink-400 transition duration-150 text-gray-900"
          placeholder="johndoe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-2">
          EMAIL ADDRESS
        </label>
        <input
          id="email"
          name="userEmail"
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-150 text-gray-900"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-black text-gray-900 mb-2">
          PASSWORD
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-pink-400 transition duration-150 text-gray-900"
          placeholder="••••••••"
        />
        <p className="mt-1 text-xs font-bold text-gray-600">Minimum 6 characters</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-black text-gray-900 mb-2">
          CONFIRM PASSWORD
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 border-4 border-black rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-150 text-gray-900"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="h-5 w-5 border-2 border-black rounded focus:ring-pink-400"
        />
        <label htmlFor="terms" className="ml-2 block text-sm font-bold text-gray-900">
          I agree to the{' '}
          <a href="#" className="text-orange-600 hover:text-orange-700 underline font-black">
            Terms & Conditions
          </a>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-4 px-6 border-4 border-black font-black text-lg rounded-xl text-white bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-pink-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-6 w-6 mr-3 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            CREATING ACCOUNT...
          </>
        ) : (
          'CREATE ACCOUNT 🎉'
        )}
      </button>
    </form>
  );
};

export default Register;