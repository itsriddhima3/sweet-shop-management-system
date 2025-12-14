import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { sweetsAPI } from '../../services/api';

const SweetCard = ({ sweet, onPurchase, onUpdate, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isOutOfStock = sweet.sweetQuantity === 0;
  const isLowStock = sweet.sweetQuantity > 0 && sweet.sweetQuantity <= 5;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await sweetsAPI.purchase(sweet._id);
      if (onPurchase) onPurchase(sweet._id);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(error.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await sweetsAPI.delete(sweet._id);
      if (onDelete) onDelete(sweet._id);
      setShowConfirm(false);
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error.response?.data?.error || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const getStockBadge = () => {
    if (isOutOfStock) {
      return (
        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
          Out of Stock
        </span>
      );
    }
    if (isLowStock) {
      return (
        <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
          Low Stock
        </span>
      );
    }
    return (
      <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
        In Stock
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-48 bg-gradient-to-br from-pink-50 to-purple-50">
          <img
            src={sweet.sweetImageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='}
            alt={sweet.sweetName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
            }}
          />
          {getStockBadge()}
          {sweet.sweetFeatured && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category Badge */}
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 mb-2 capitalize">
            {sweet.sweetCategory}
          </span>

          {/* Name */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
            {sweet.sweetName}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
            {sweet.sweetDescription || 'Delicious sweet treat waiting for you!'}
          </p>

          {/* Price and Quantity */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-2xl font-bold text-purple-600">
                ${sweet.sweetPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="text-sm font-semibold text-gray-900">{sweet.sweetQuantity}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {!isAdmin && (
              <button
                onClick={handlePurchase}
                disabled={isOutOfStock || loading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-150 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  '🛒 Purchase'
                )}
              </button>
            )}

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdate(sweet)}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-150"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Delete Sweet?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Are you sure you want to delete "{sweet.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition duration-150"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-150 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SweetCard;