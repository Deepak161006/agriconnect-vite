import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoriesPage() {
  const navigate = useNavigate();

  // --- 1. UPDATED Auth Check ---
  // Changed from sessionStorage to localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Consumer') {
      alert('Access Denied. Please log in as a Consumer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  const handleCategoryClick = (category) => {
    // This logic stays the same. It works perfectly.
    sessionStorage.setItem('preselectedCategory', category);
    navigate('/dashboard'); // Navigate to the dashboard, which will read this value
  };

  return (
    <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
      <div className="text-center fade-in">
        <h1 className="text-4xl font-extrabold text-gray-900">Explore Our Categories</h1>
        <p className="mt-4 text-lg text-gray-600">Find the freshest products by category.</p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Category Card: Vegetables */}
        <div
          onClick={() => handleCategoryClick('vegetable')}
          className="category-card group fade-in relative h-64 rounded-xl shadow-lg overflow-hidden cursor-pointer"
          style={{ '--delay': '100ms' }}
        >
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110" style={{ backgroundImage: "url('/images/category-vegetables.jpg')" }}></div>
          <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-60"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-center p-4">
            <h2 className="text-white font-bold text-3xl">Vegetables</h2>
            <div className="mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="inline-block bg-white text-green-600 font-semibold py-2 px-5 rounded-full text-sm">
                Shop Now <i className="fas fa-arrow-right ml-1"></i>
              </span>
            </div>
          </div>
        </div>

        {/* Category Card: Fruits */}
        <div
          onClick={() => handleCategoryClick('fruit')}
          className="category-card group fade-in relative h-64 rounded-xl shadow-lg overflow-hidden cursor-pointer"
          style={{ '--delay': '200ms' }}
        >
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110" style={{ backgroundImage: "url('/images/category-fruits.jpg')" }}></div>
          <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-60"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-center p-4">
            <h2 className="text-white font-bold text-3xl">Fruits</h2>
            <div className="mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-Y-0 transition-all duration-300">
              <span className="inline-block bg-white text-green-600 font-semibold py-2 px-5 rounded-full text-sm">
                Shop Now <i className="fas fa-arrow-right ml-1"></i>
              </span>
            </div>
          </div>
        </div>

        {/* Category Card: Grains */}
        <div
          onClick={() => handleCategoryClick('grain')}
          className="category-card group fade-in relative h-64 rounded-xl shadow-lg overflow-hidden cursor-pointer"
          style={{ '--delay': '300ms' }}
        >
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110" style={{ backgroundImage: "url('/images/category-grains.jpg')" }}></div>
          <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-60"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-center p-4">
            <h2 className="text-white font-bold text-3xl">Grains</h2>
            <div className="mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="inline-block bg-white text-green-600 font-semibold py-2 px-5 rounded-full text-sm">
                Shop Now <i className="fas fa-arrow-right ml-1"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CategoriesPage;