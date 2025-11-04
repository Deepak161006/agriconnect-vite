import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderQuantity, setOrderQuantity] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Consumer') {
      alert('Access Denied. Please log in as a Consumer.');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        alert('Could not find product.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  // --- NEW: Helper function to get location ---
  // This turns the old callback into a modern "Promise"
  const getConsumerLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by this browser."));
      }
      // navigator.geolocation.getCurrentPosition(resolve, reject);
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error)
      );
    });
  };

  // --- NEW: Helper function to save location ---
  const saveLocation = async (latitude, longitude) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/updeme`, 
        { location: { latitude, longitude } },
        config
      );
      console.log('Consumer location saved!');
    } catch (err) {
      // Don't bother the user, just log it
      console.error('Failed to save consumer location', err);
    }
  };

  // --- UPDATED: handlePlaceOrder function ---
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to place an order.');
      return;
    }
    if (orderQuantity <= 0) {
      alert('Quantity must be greater than zero.');
      return;
    }

    // --- 1. ASK FOR LOCATION FIRST ---
    let userLocation;
    try {
      userLocation = await getConsumerLocation();
      // We got the location, save it in the background
      saveLocation(userLocation.latitude, userLocation.longitude);

    } catch (locationError) {
      // --- 2. HANDLE LOCATION ERRORS ---
      if (locationError.code === 1) { // 1 = PERMISSION_DENIED
        alert('Location permission is required to place an order. Please allow location and try again.');
      } else {
        alert(`Could not get your location: ${locationError.message}`);
      }
      return; // Stop the order
    }

    // --- 3. PROCEED WITH ORDER (if location was successful) ---
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const orderData = {
      productId: product._id,
      productDetails: {
        name: product.name,
        quantity: `${orderQuantity} ${product.unit}`
      }
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, config);
      alert('Order placed successfully! You can see it in your "My Orders" list.');
      // We don't navigate, to avoid the stale state bug

    } catch (orderError) {
      console.error('Failed to place order:', orderError);
      alert('Failed to place order. Please try again.');
    }
  };

  // --- (Rest of the JSX is the same) ---
  
  if (loading || !product) {
    return (
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 text-center">
        <p className="text-lg text-gray-500">Loading Product...</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0 fade-in">
        <nav id="breadcrumbs" className="text-sm font-medium mb-6 text-gray-500">
          <Link to="/dashboard" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <button 
            onClick={() => {
              sessionStorage.setItem('preselectedCategory', product.category.toLowerCase());
              navigate('/dashboard');
            }} 
            className="hover:text-blue-600"
          >
            {product.category}
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  id="product-image" 
                  src={product.image || `https://placehold.co/600x400/EFEFEF/333?text=${product.name}`}
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center">
              <h1 id="product-name" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{product.name}</h1>
              <div id="product-price" className="mt-4">
                <p className="text-4xl font-bold text-gray-900">
                  ₹{product.price} <span className="text-xl font-normal text-gray-500">/ {product.unit}</span>
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <p id="product-description" className="mt-2 text-base text-gray-600">{product.description}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Order Quantity</h3>
                <div className="flex items-center gap-4 mt-2">
                  <input 
                    type="number"
                    id="quantity"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                  <span className="text-gray-700">{product.unit}</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <a 
                  id="contact-farmer-btn" 
                  href={`tel:${product.producer.tel || ''}`} 
                  className="w-full bg-gray-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700"
                >
                  <i className="fas fa-phone-alt mr-3"></i>
                  Contact Farmer
                </a>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 transition-transform duration-300 hover:scale-105"
                >
                  <i className="fas fa-shopping-basket mr-3"></i>
                  Place Order
                </button>
              </div>

              <div id="sold-by" className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-md font-medium text-gray-900">Sold By</h3>
                <div className="flex items-center mt-2">
                  <img 
                    className="h-12 w-12 rounded-full" 
                    src={`https://placehold.co/48x48/EFEFEF/333?text=${product.producer.fullName.charAt(0)}`}
                    alt="Farmer" 
                  />
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-800">{product.producer.fullName}</p>
                    {/* Display location if it exists */}
                    <p className="text-sm text-gray-600">{product.producer.location ? 'Location Shared' : 'Location not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;