import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ContactPage() {
  const navigate = useNavigate();

  // --- 1. UPDATED Auth Check ---
  // Changed from sessionStorage to localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Producer') {
      alert('Access Denied. Please log in as a Producer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // --- 2. Converted form logic to React ---
  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const email = event.target.elements.email.value;
    const message = event.target.elements.message.value;

    if (!name || !email || !message) {
      alert('Please fill out all fields before sending.');
      return;
    }

    alert(`Thank you, ${name}! Your message has been sent. We will get back to you shortly.`);
    event.target.reset(); // Reset the form
  };

  return (
    <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden fade-in">
        <div className="text-center py-16 bg-green-600 text-white">
          <h1 className="text-4xl font-extrabold">Get in Touch</h1>
          <p className="mt-4 text-lg text-green-100">We're here to help you with any questions or issues.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            {/* 3. Added onSubmit to the form */}
            <form id="contact-form" className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input type="text" id="name" required className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="Full Name" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" id="email" required className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="Email Address" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea id="message" rows="5" required className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder="Your Message"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105">
                  Send Message
                </button>
              </div>
            </form>
          </div>
          {/* Contact Information */}
          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <div className="space-y-6 text-gray-700">
              <p className="flex items-start">
                <i className="fas fa-map-marker-alt fa-fw mt-1 mr-4 text-green-600"></i>
                <span>Vignan's University, Vadlamudi, Guntur, Andhra Pradesh, India</span>
              </p>
              <p className="flex items-center">
                <i className="fas fa-phone-alt fa-fw mr-4 text-green-600"></i>
                <span>+91 12345 67890</span>
              </p>
              <p className="flex items-center">
                <i className="fas fa-envelope fa-fw mr-4 text-green-600"></i>
                <span>support@agriconnect.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ContactPage;