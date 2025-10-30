import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (userType) => {
  if (!email || !password) {
    alert('Please fill in both email and password fields.');
    return;
  }

  try {
    // 1. Call your backend API
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      email,
      password,
    });

    // 2. Check if the user type matches the button they clicked
    if (res.data.userType !== userType) {
      return alert(`Login failed: You are registered as a ${res.data.userType}.`);
    }

    // 3. Save the token and user type to localStorage (it's better than sessionStorage)
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userType', res.data.userType);

    alert(`Welcome, ${res.data.name}!`);

    // 4. Redirect to the correct dashboard
    if (userType === 'Producer') {
      navigate('/producer/dashboard');
    } else {
      navigate('/dashboard');
    }

  } catch (err) {
    // If the API sends an error (e.g., "Invalid credentials")
    alert('Login failed. Please check your email and password.');
    console.error(err);
  }
};

  return (
    <div className="background-container min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative w-full max-w-md p-8 space-y-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl fade-in">
        <div className="text-center">
          <i className="fas fa-leaf fa-3x text-green-600"></i>
          <h1 className="text-4xl font-bold text-gray-800 mt-4">AgriConnect</h1>
          <p className="mt-2 text-gray-600">Your Digital Farmer's Market</p>
        </div>

        <form id="login-form" className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm font-medium text-gray-700">Login as:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                id="producer-login"
                onClick={() => handleLogin('Producer')}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-tractor mr-2"></i>
                Producer
              </button>
              <button
                type="button"
                id="consumer-login"
                onClick={() => handleLogin('Consumer')}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-shopping-basket mr-2"></i>
                Consumer
              </button>
            </div>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          New to AgriConnect?
          <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;