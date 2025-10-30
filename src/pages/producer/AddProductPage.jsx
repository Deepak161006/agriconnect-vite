import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. IMPORT AXIOS

function AddProductPage() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  
  // 2. ADDED state for form inputs
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables', // Default value
    quantity: '',
    price: '',
    unit: 'per kg', // Default value
  });

  // 3. UPDATED Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Producer') {
      alert('Access Denied. Please log in as a Producer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // A handler to update our state as the user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      // In a real app, you'd also set this file to state for uploading
    }
  };

  // 4. UPDATED handleSubmit to call the API
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the token from storage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add a product.');
      return;
    }

    // We must send the token in the headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    // Prepare the data to send
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      unit: formData.unit,
      // Note: Image uploading is a more complex step
      // For now, the backend will just use a null/default image
    };

    try {
      // Call the API
      await axios.post(`${import.meta.env.VITE_API_URL}/api/producer/products`, productData, config);

      alert(`"${productData.name}" has been successfully listed!`);
      navigate('/producer/dashboard');

    } catch (err) {
      console.error('Failed to add product:', err);
      alert('Failed to list product. Please try again.');
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0 fade-in">
        <div className="pb-5 border-b border-gray-200">
          <h2 className="text-3xl font-bold leading-7 text-gray-900">List a New Product</h2>
          <p className="mt-2 text-md text-gray-600">Fill in the details below to add your produce to the marketplace.</p>
        </div>

        {/* 5. UPDATED Form to use state */}
        <form id="add-product-form" className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
              <input 
                type="text" 
                id="name" 
                required 
                placeholder="e.g., Fresh Organic Tomatoes" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange} 
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description" 
                rows="4" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" 
                placeholder="Describe your product, its quality, and origin."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                  id="category" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Grains</option>
                  <option>Dairy</option>
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Available Quantity</label>
                <input 
                  type="number" 
                  id="quantity" 
                  required 
                  placeholder="e.g., 50" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.quantity}
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input 
                  type="number" 
                  id="price" 
                  required 
                  placeholder="e.g., 30" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                <select 
                  id="unit" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option>per kg</option>
                  <option>per piece</option>
                  <option>per dozen</option>
                  <option>per quintal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div id="image-upload-box" className="mt-1 relative flex justify-center items-center h-48 w-full rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                {imagePreview && (
                  <img id="image-preview" src={imagePreview} alt="Image Preview" className="absolute h-full w-full object-cover rounded-md" />
                )}
                <div id="upload-prompt" className={`space-y-1 text-center ${imagePreview ? 'hidden' : ''}`}>
                  <i className="fas fa-cloud-upload-alt fa-3x text-gray-400"></i>
                  <div className="flex text-sm text-gray-600">
                    <span className="font-medium text-green-600 hover:text-green-500">Upload a file</span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <input id="file-upload" type="file" className="file-input-hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/producer/dashboard')}
              className="rounded-md border border-gray-300 bg-white py-2 px-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              List Product
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddProductPage;