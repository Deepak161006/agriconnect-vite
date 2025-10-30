import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // 1. IMPORT AXIOS

// 2. DELETED the static 'allProducts' array

const filters = [
  { key: 'all', name: 'All' },
  { key: 'vegetable', name: 'Vegetables' },
  { key: 'fruit', name: 'Fruits' },
  { key: 'grain', name: 'Grains' },
  { key: 'dairy', name: 'Dairy' },
];

function ConsumerDashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // 3. ADDED state for products
  const [products, setProducts] = useState([]); // Master list
  const [filteredProducts, setFilteredProducts] = useState([]); // List to display

  // 4. UPDATED Auth Check (uses localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Consumer') {
      alert('Access Denied. Please log in as a Consumer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // 5. ADDED useEffect to fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/products');
        setProducts(res.data);
        setFilteredProducts(res.data); // Initially, show all
      } catch (err) {
        console.error('Failed to fetch products:', err);
        alert('Could not load products. Please try again later.');
      }
    };
    fetchProducts();
  }, []); // [] means this runs once on page load

  // --- FILTERING LOGIC ---
  useEffect(() => {
    // This checks if we came from the categories page
    const preselectedCategory = sessionStorage.getItem('preselectedCategory');
    if (preselectedCategory) {
      handleFilterChange(preselectedCategory);
      sessionStorage.removeItem('preselectedCategory'); // Clean up
    }
  }, [products]); // Re-run this if products load *after* preselectedCategory is set

  // 6. UPDATED filter logic to use state
  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category.toLowerCase() === category));
    }
  };

  return (
    <>
      <header className="bg-blue-600 text-white fade-in">
        <div className="max-w-4xl mx-auto text-center py-20 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold">Freshness You Can Trust</h2>
          <p className="mt-4 text-lg text-blue-100">The best produce, straight from local farms to your table.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div id="category-filters" className="flex justify-center flex-wrap gap-3 mb-10 fade-in" style={{ '--delay': '200ms' }}>
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`filter-btn py-2 px-5 rounded-full text-sm font-semibold border ${
                selectedCategory === filter.key
                  ? 'filter-active'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* 7. UPDATED JSX to map API data */}
        <div id="product-grid" className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 fade-in" style={{ '--delay': '400ms' }}>
          {filteredProducts.map(product => (
            <Link
              key={product._id} // Use database _id
              to={`/product/${product._id}`} // Use database _id
              className="product-card group block bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl"
            >
              <div className="image-wrapper w-full h-56">
                <img 
                  src={`https://placehold.co/600x400/EFEFEF/333?text=${product.name}`} // Placeholder image
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  ₹{product.price} <span className="text-sm font-normal text-gray-500">/ {product.unit}</span>
                </p>
                {/* Check if producer data exists before trying to access it */}
                <p className="text-xs text-gray-500 mt-1">
                  Farmer: {product.producer ? product.producer.fullName : 'N/A'}
                </p>
              </div>
            </Link>
          ))}

          {/* Added a message for when no products are found */}
          {filteredProducts.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              Loading products or none found in this category.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

export default ConsumerDashboard;