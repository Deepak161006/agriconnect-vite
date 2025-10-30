import React, { useState, useEffect } from 'react'; // 1. IMPORT hooks
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // 2. IMPORT axios

function ProducerDashboard() {
  const navigate = useNavigate();
  // 3. ADD state for products
  const [myProducts, setMyProducts] = useState([]);

  // 4. UPDATE Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Producer') {
      alert('Access Denied. Please log in as a Producer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // 5. ADD useEffect to fetch producer's products
  useEffect(() => {
    const fetchMyProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Should be covered by auth check, but good practice

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/producer/my-products`, config);
        setMyProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchMyProducts();
  }, []); // [] runs once on page load

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
              {/* 6. MAKE Total Products Dynamic */}
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

        {/* --- 7. MAKE Product List Dynamic --- */}
        <div className="mt-10 fade-in" style={{ '--delay': '500ms' }}>
          <h3 className="text-2xl font-bold text-gray-900">Your Products</h3>
          <div className="mt-4 bg-white shadow-lg overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              
              {myProducts.length > 0 ? (
                myProducts.map(product => (
                  <li key={product._id}>
                    <Link to="#" className="block hover:bg-gray-50 transition duration-300">
                      <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                          <div className="flex-shrink-0">
                            <img 
                              className="h-16 w-16 rounded-lg object-cover shadow-sm" 
                              src={`https://placehold.co/100x100/EFEFEF/333?text=${product.name.charAt(0)}`} 
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
                        <div><i className="fas fa-chevron-right text-gray-400"></i></div>
                      </div>
                    </Link>
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