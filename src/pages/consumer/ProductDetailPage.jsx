import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderQuantity, setOrderQuantity] = useState(1);

  // --- 1. UPDATE state to be an object ---
  const [deliveryAddress, setDeliveryAddress] = useState({
    houseNo: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });

  // ... (Your useEffects for auth and fetching product are perfect) ...
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
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${productId}` // <-- Must be /products/
        );
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

  // --- 2. NEW function to handle address object state ---
  const handleAddressChange = (e) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  // --- 3. UPDATE handlePlaceOrder ---
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) { /* ... (no change) ... */ }
    if (orderQuantity <= 0) { /* ... (no change) ... */ }

    // --- NEW: Check for all required address fields ---
    if (!deliveryAddress.houseNo || !deliveryAddress.area || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.pincode) {
      alert('Please fill out all delivery address fields.');
      return;
    }

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
      },
      deliveryAddress: deliveryAddress // Send the whole object
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, config);
      alert('Order placed successfully! You can see it in your "My Orders" list.');
    } catch (orderError) {
      console.error('Failed to place order:', orderError);
      alert('Failed to place order. Please try again.');
    }
  };

  
  if (loading || !product) { /* ... (no change) ... */ }

  return (
    <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0 fade-in">
        {/* ... (no change to breadcrumbs, image, product info) ... */}
        
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
              {/* ... (no change to name, price, description) ... */}
              <h1 id="product-name" className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{product.name}</h1>
              {/* ... (price) ... */}
              <div id="product-price" className="mt-4">
                <p className="text-4xl font-bold text-gray-900">
                  ₹{product.price} <span className="text-xl font-normal text-gray-500">/ {product.unit}</span>
                </p>
              </div>
              {/* ... (description) ... */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <p id="product-description" className="mt-2 text-base text-gray-600">{product.description}</p>
              </div>
              {/* ... (quantity) ... */}
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

              {/* --- 4. REPLACE textarea with new inputs --- */}
              <div className="mt-8">
                <label className="text-lg font-medium text-gray-900">
                  Delivery Location
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <input 
                    type="text" name="houseNo" placeholder="House/Flat No." required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={deliveryAddress.houseNo} onChange={handleAddressChange}
                  />
                  <input 
                    type="text" name="area" placeholder="Area" required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={deliveryAddress.area} onChange={handleAddressChange}
                  />
                  <input 
                    type="text" name="city" placeholder="City" required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={deliveryAddress.city} onChange={handleAddressChange}
                  />
                  <input 
                    type="text" name="state" placeholder="State" required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={deliveryAddress.state} onChange={handleAddressChange}
                  />
                  <input 
                    type="text" name="pincode" placeholder="Pincode" required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={deliveryAddress.pincode} onChange={handleAddressChange}
                  />
                </div>
              </div>
              {/* ------------------------------------- */}

              {/* ... (no change to buttons or "Sold By" box) ... */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* ... (contact farmer button) ... */}
                <a id="contact-farmer-btn" href={`tel:${product.producer.tel || ''}`} className="w-full bg-gray-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700">
                  <i className="fas fa-phone-alt mr-3"></i>
                  Contact Farmer
                </a>
                {/* ... (place order button) ... */}
                <button onClick={handlePlaceOrder} className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 transition-transform duration-300 hover:scale-105">
                  <i className="fas fa-shopping-basket mr-3"></i>
                  Place Order
                </button>
              </div>
              {/* ... (sold by box) ... */}
              <div id="sold-by" className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-md font-medium text-gray-900">Sold By</h3>
                <div className="flex items-center mt-2">
                  <img className="h-12 w-12 rounded-full" src={`https://placehold.co/48x48/EFEFEF/333?text=${product.producer.fullName.charAt(0)}`} alt="Farmer" />
                  <div className="ml-4">
                    <p className="text-lg font-semibold text-gray-800">{product.producer.fullName}</p>
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