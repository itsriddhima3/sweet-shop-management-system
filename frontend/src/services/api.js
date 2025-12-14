import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      console.error('Access denied. Admin privileges required.');
    }

    if (error.response?.status === 500) {
      console.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================

export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - {userName, userEmail, userPassword}
   * @returns {Promise} Response with token and user data
   */
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  /**
   * Login user
   * @param {Object} credentials - {email, password}
   * @returns {Promise} Response with token and user data
   */
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  /**
   * Get current user profile
   * @returns {Promise} Response with user data
   */
  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  /**
   * Send reset OTP to email
   * @param {string} email - User email
   * @returns {Promise} Response
   */
  sendResetOtp: (email) => {
    return api.post('/auth/send-reset-otp', { userEmail: email });
  },

  /**
   * Reset password with OTP
   * @param {Object} data - {userEmail, otp, newPassword}
   * @returns {Promise} Response
   */
  resetPassword: (data) => {
    return api.post('/auth/reset-password', data);
  },
};

// ==================== SWEETS API ====================

export const sweetsAPI = {
  /**
   * Get all sweets
   * @returns {Promise} Response with array of sweets
   */
  getAll: () => {
    return api.get('/sweets');
  },

  /**
   * Get a single sweet by ID
   * @param {string} id - Sweet ID
   * @returns {Promise} Response with sweet data
   */
  getById: (id) => {
    return api.get(`/sweets/${id}`);
  },

  /**
   * Search sweets with filters
   * @param {Object} params - {name, category, minPrice, maxPrice, inStock}
   * @returns {Promise} Response with filtered sweets
   */
  search: (params) => {
    // Remove empty parameters
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return api.get('/sweets/search', { params: cleanParams });
  },

  /**
   * Create a new sweet (Admin only)
   * @param {Object} sweetData - Sweet data
   * @returns {Promise} Response with created sweet
   */
  create: (sweetData) => {
    return api.post('/sweets', sweetData);
  },

  /**
   * Update a sweet (Admin only)
   * @param {string} id - Sweet ID
   * @param {Object} sweetData - Updated sweet data
   * @returns {Promise} Response with updated sweet
   */
  update: (id, sweetData) => {
    return api.put(`/sweets/${id}`, sweetData);
  },

  /**
   * Delete a sweet (Admin only)
   * @param {string} id - Sweet ID
   * @returns {Promise} Response confirming deletion
   */
  delete: (id) => {
    return api.delete(`/sweets/${id}`);
  },

  /**
   * Purchase a sweet (decrease quantity by 1)
   * @param {string} id - Sweet ID
   * @returns {Promise} Response with updated sweet
   */
  purchase: (id) => {
    return api.post(`/sweets/${id}/purchase`);
  },

  /**
   * Restock a sweet (Admin only)
   * @param {string} id - Sweet ID
   * @param {number} quantity - Amount to add to stock
   * @returns {Promise} Response with updated sweet
   */
  restock: (id, quantity) => {
    return api.post(`/sweets/${id}/restock`, { quantity });
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get current user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Logout user (clear storage)
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api;