import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SweetsList from '../components/Sweets/SweetsList';
import AddSweetForm from '../components/Sweets/AddSweetForm';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = user?.role === 'admin';

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setEditingSweet(null);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  const handleUpdateSweet = (sweet) => {
    setEditingSweet(sweet);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSweet(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.userName}! 👋
              </h1>
              <p className="text-purple-100 text-lg">
                {isAdmin 
                  ? 'Manage your sweet shop inventory' 
                  : 'Browse and purchase your favorite sweets'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {isAdmin && !showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add New Sweet</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards (Admin Only) */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">--</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">--</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Out of Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">--</p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Sweet Form */}
        {isAdmin && showAddForm && (
          <div className="mb-8">
            <AddSweetForm 
              sweet={editingSweet}
              onSuccess={handleAddSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Sweets List */}
        <SweetsList 
          key={refreshKey}
          onUpdateSweet={handleUpdateSweet}
        />
      </div>
    </div>
  );
};

export default Dashboard;