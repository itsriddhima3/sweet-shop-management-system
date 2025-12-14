import React, { useState, useEffect } from 'react';
import SweetCard from './SweetCard';
import SearchBar from './SearchBar';
import { sweetsAPI } from '../../services/api';

const SweetsList = ({ onUpdateSweet }) => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sweets, searchTerm, filters]);

  const fetchSweets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sweetsAPI.getAll();
      setSweets(response.data.sweets || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch sweets');
      console.error('Fetch sweets error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...(sweets || [])];

    if (searchTerm) {
      result = result.filter(sweet =>
        sweet.sweetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.sweetDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.category) {
      result = result.filter(sweet => 
        sweet.sweetCategory.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.minPrice) {
      result = result.filter(sweet => sweet.sweetPrice >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(sweet => sweet.sweetPrice <= parseFloat(filters.maxPrice));
    }

    if (filters.inStock) {
      result = result.filter(sweet => sweet.sweetQuantity > 0);
    }

    setFilteredSweets(result);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePurchase = async (sweetId) => {
  
    setSweets(prevSweets =>
      prevSweets.map(sweet =>
        sweet._id === sweetId
          ? { ...sweet, sweetQuantity: sweet.sweetQuantity - 1 }
          : sweet
      )
    );

    showNotification('Purchase successful! 🎉', 'success');
  };

  const handleDelete = async (sweetId) => {
    setSweets(prevSweets => prevSweets.filter(sweet => sweet._id !== sweetId));
    showNotification('Sweet deleted successfully', 'success');
  };

  const showNotification = (message, type) => {

    alert(message);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg">Loading delicious sweets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error Loading Sweets</h3>
              <p className="text-red-700 mt-2">{error}</p>
              <button
                onClick={fetchSweets}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sweet Shop 🍬
        </h1>
        <p className="text-gray-600">
          Discover our delicious collection of sweets and treats
        </p>
      </div>

      {/* Search and Filters */}
      <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Results Info */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-purple-600">{filteredSweets?.length || 0}</span> of{' '}
          <span className="font-semibold">{sweets?.length || 0}</span> sweets
        </p>
        <button
          onClick={fetchSweets}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition duration-150"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Sweets Grid */}
      {filteredSweets && filteredSweets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet) => (
            <SweetCard
              key={sweet._id}
              sweet={sweet}
              onPurchase={handlePurchase}
              onUpdate={onUpdateSweet}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No sweets found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filters.category || filters.minPrice || filters.maxPrice
              ? "Try adjusting your search or filters"
              : "No sweets available at the moment"}
          </p>
          {(searchTerm || filters.category || filters.minPrice || filters.maxPrice) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  inStock: false
                });
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-150"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Load More Button (Optional - for pagination) */}
      {filteredSweets.length > 0 && filteredSweets.length < sweets.length && (
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Showing {filteredSweets.length} of {sweets.length} sweets
          </p>
        </div>
      )}
    </div>
  );
};

export default SweetsList;