import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
  event.preventDefault();

  // --- Form Validation (same as before) ---
  if (!fullName || !email || !password || !confirmPassword) {
    alert('Please fill out all the required fields.');
    return;
  }
  if (password !== confirmPassword) {
    alert('Passwords do not match. Please try again.');
    return;
  }
  if (!userType) {
    alert('Please select whether you are a Producer or a Consumer.');
    return;
  }

  // --- API Call ---
  try {
    // 1. Call your backend API's /register endpoint
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      fullName,
      email,
      password,
      userType
    });

    // 2. If successful, tell the user and send them to the login page
    alert('Account created successfully! You can now log in.');
    navigate('/'); // Redirect to login page

  } catch (err) {
    // 3. If it fails (e.g., user already exists)
    alert('Registration failed. That email may already be in use.');
    console.error(err);
  }
};

  return (
    <div className="background-container min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative w-full max-w-md p-8 space-y-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create Your Account</h1>
          <p className="mt-2 text-sm text-gray-600">Join the future of farming.</p>
        </div>
        <form id="register-form" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <input
              id="full-name"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              id="email-address"
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              type="password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              id="confirm-password"
              type="password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <select
              id="user-type"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white text-gray-500 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="" disabled>I am a...</option>
              <option value="Producer">Producer (Farmer)</option>
              <option value="Consumer">Consumer</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link to="/" className="font-medium text-green-600 hover:text-green-500">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;