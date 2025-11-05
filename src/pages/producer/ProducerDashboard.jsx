import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProducerDashboard() {
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Producer') {
      alert('Access Denied. Please log in as a Producer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // Fetch Producer's Products
  useEffect(() => {
    const fetchMyProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; 

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/my-products`, config);
        setMyProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    
    fetchMyProducts();
  }, []);

  // Ask for and save producer's location
  useEffect(() => {
    const saveLocation = async (latitude, longitude) => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/auth/updateme`, 
          { location: { latitude, longitude } },
          config
        );
        console.log('Producer location saved!');
      } catch (err) {
        console.error('Failed to save location', err);
      }
    };

    const handleLocationError = (error) => {
      if (error.code === 1) { // 1 = PERMISSION_DENIED
        alert('Please consider enabling location. It helps consumers find your products!');
      } else {
        console.error("Geolocation error:", error.message);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          saveLocation(position.coords.latitude, position.coords.longitude);
        }, 
        handleLocationError
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  
  // --- NEW: Delete Product Handler ---
  const handleDeleteProduct = async (productId) => {
    // Ask for confirmation first
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, config);
      
      // Update state to remove the product instantly
      setMyProducts(currentProducts => 
        currentProducts.filter(product => product._id !== productId)
      );
      alert('Product deleted successfully.');
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="pb-5 border-b border-gray-200 fade-in">
          <h2 className="text-3xl font-bold leading-7 text-gray-900">Welcome back, Farmer! 🌱</h2>
          <p className="mt-2 text-md text-gray-600">Here's an overview of your store performance.</p>
        </div>

        {/* --- Stat Cards (Dynamic) --- */}
        <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card fade-in bg-white overflow-hidden shadow-lg rounded-lg p-5 transform transition hover:-translate-y-2 duration-300" style={{'--delay': '100ms'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3"><i className="fas fa-seedling fa-lg text-white"></i></div>
              <div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt><dd className="text-3xl font-semibold text-gray-900">{myProducts.length}</dd></dl></div>
            </div>
          </div>
          <div className="stat-card fade-in bg-white overflow-hidden shadow-lg rounded-lg p-5 transform transition hover:-translate-y-2 duration-300" style={{'--delay': '200ms'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3"><i className="fas fa-shopping-cart fa-lg text-white"></i></div>
              <div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt><dd className="text-3xl font-semibold text-gray-900">0</dd></dl></div>
            </div>
          </div>
          <div className="stat-card fade-in bg-white overflow-hidden shadow-lg rounded-lg p-5 transform transition hover:-translate-y-2 duration-300" style={{'--delay': '300ms'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3"><i className="fas fa-rupee-sign fa-lg text-white"></i></div>
              <div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 truncate">Revenue (Month)</dt><dd className="text-3xl font-semibold text-gray-900">0</dd></dl></div>
            </div>
          </div>
          <div className="stat-card fade-in bg-green-600 overflow-hidden shadow-lg rounded-lg hover:bg-green-700 transition transform hover:-translate-y-2 duration-300" style={{'--delay': '400ms'}}>
            <Link to="/producer/add-product" className="block h-full p-5">
              <div className="h-full flex flex-col justify-center items-center text-white">
                <i className="fas fa-plus-circle fa-2x"></i>
                <p className="mt-2 font-semibold">Add New Product</p>
              </div>
            </Link>
          </div>
        </div>

        {/* --- Product List --- */}
        <div className="mt-10 fade-in" style={{ '--delay': '500ms' }}>
          <h3 className="text-2xl font-bold text-gray-900">Your Products</h3>
          <div className="mt-4 bg-white shadow-lg overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              
              {myProducts.length > 0 ? (
                myProducts.map(product => (
                  <li key={product._id}>
                    <div className="block hover:bg-gray-50 transition duration-300">
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <img 
                              className="h-16 w-16 rounded-lg object-cover shadow-sm" 
                              src={product.image || `https://placehold.co/100x100/EFEFEF/333?text=${product.name.charAt(0)}`} 
                              alt={product.name} 
                            />
                          </div>
                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            <div>
                              <p className="text-lg font-semibold text-green-700 truncate">{product.name}</p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">In Stock: {product.quantity} {product.unit}</p>
                            </div>
                            <div className="hidden md:block">
                              <div>
                                <p className="text-sm text-gray-900">Price: <span className="font-semibold">₹{product.price} / {product.unit}</span></p>
                                <p className="mt-1 text-sm text-gray-500">
                                  Listed on: {new Date(product.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* --- DELETE BUTTON ADDED --- */}
                        <div className="flex items-center">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteProduct(product._id);
                            }}
                            className="ml-4 text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                        {/* --------------------------- */}

                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 p-6">
                  You haven't listed any products yet. <Link to="/producer/add-product" className="text-green-600 font-medium">Add one now!</Link>
                </li>
              )}

            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProducerDashboard;