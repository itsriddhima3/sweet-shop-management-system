// frontend/src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const features = [
    {
      icon: '🍬',
      title: 'Wide Selection',
      description: 'Browse hundreds of delicious sweets from around the world',
      color: 'from-orange-400 to-pink-500'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Get your treats delivered right to your doorstep',
      color: 'from-pink-400 to-orange-500'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive pricing with special deals and discounts',
      color: 'from-orange-500 to-pink-400'
    },
    {
      icon: '⭐',
      title: 'Quality Assured',
      description: 'Only the finest and freshest sweets make it to our shop',
      color: 'from-pink-500 to-orange-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-orange-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="bg-black rounded-3xl p-6 border-8 border-white shadow-2xl transform hover:scale-110 transition-all duration-300">
                <svg className="w-24 h-24 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-[0_6px_6px_rgba(0,0,0,0.8)] tracking-tighter leading-none">
              SWEET SHOP
            </h1>
            <p className="text-2xl md:text-3xl mb-10 text-black font-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
              Your one-stop destination for the SWEETEST treats! 🍭
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-10 py-5 bg-black text-white font-black text-xl rounded-2xl hover:bg-gray-900 transform hover:scale-110 transition-all duration-200 shadow-2xl border-4 border-white"
                >
                  BROWSE SWEETS 🛍️
                </button>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-10 py-5 bg-black text-white font-black text-xl rounded-2xl hover:bg-gray-900 transform hover:scale-110 transition-all duration-200 shadow-2xl border-4 border-white"
                  >
                    GET STARTED 🚀
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-y-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
              WHY SWEET SHOP?
            </h2>
            <p className="text-xl font-bold text-gray-600">
              Making sweet shopping SIMPLE, FUN, and DELIGHTFUL!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:-translate-y-3 transition-all duration-300 border-4 border-black"
              >
                <div className={`inline-block bg-gradient-to-br ${feature.color} rounded-2xl p-6 mb-4 border-4 border-black`}>
                  <div className="text-5xl">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 font-semibold">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
              POPULAR CATEGORIES
            </h2>
            <p className="text-xl font-bold text-gray-600">
              Explore our DIVERSE collection of sweets!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Chocolates', emoji: '🍫', color: 'from-orange-500 to-orange-600' },
              { name: 'Candies', emoji: '🍬', color: 'from-pink-500 to-pink-600' },
              { name: 'Gummies', emoji: '🍡', color: 'from-orange-400 to-pink-500' },
              { name: 'Lollipops', emoji: '🍭', color: 'from-pink-400 to-orange-500' },
            ].map((category, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${category.color} rounded-2xl shadow-xl p-10 text-center text-white transform hover:scale-110 transition-all duration-300 cursor-pointer border-4 border-black`}
                onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
              >
                <div className="text-7xl mb-4">{category.emoji}</div>
                <h3 className="text-2xl font-black">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-pink-600 to-orange-600 border-y-8 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            Ready to Satisfy Your Sweet Tooth?
          </h2>
          <p className="text-2xl mb-10 text-black font-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]">
            Join THOUSANDS of happy customers today!
          </p>
          {!user && (
            <Link
              to="/auth"
              className="inline-block px-12 py-6 bg-black text-white font-black rounded-2xl text-2xl hover:bg-gray-900 transform hover:scale-110 transition-all duration-200 shadow-2xl border-4 border-white"
            >
              CREATE FREE ACCOUNT 🎉
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Sweets Available', color: 'orange' },
              { number: '10K+', label: 'Happy Customers', color: 'pink' },
              { number: '50+', label: 'Categories', color: 'orange' },
              { number: '24/7', label: 'Support', color: 'pink' },
            ].map((stat, index) => (
              <div key={index} className={`text-center p-6 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 border-4 border-black`}>
                <div className={`text-5xl md:text-6xl font-black text-${stat.color}-600 mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-900 text-lg font-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;