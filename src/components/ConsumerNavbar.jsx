import React, { useState } from 'react'; // 1. IMPORT useState
import { NavLink, useNavigate } from 'react-router-dom';

function ConsumerNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 2. ADD state for mobile menu

  const handleLogout = () => {
    localStorage.clear(); // Use localStorage to match your login logic
    alert('You have been logged out successfully.');
    navigate('/');
  };

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = 'px-3 py-2 rounded-md text-sm font-medium transition-colors';
    return isActive
      ? `${baseClasses} nav-active-consumer`
      : `${baseClasses} text-gray-500 hover:bg-gray-200`;
  };

  // 3. ADD classes for the mobile nav links
  const getMobileNavLinkClass = ({ isActive }) => {
    const baseClasses = 'block px-3 py-2 rounded-md text-base font-medium';
    return isActive
      ? `${baseClasses} nav-active-consumer`
      : `${baseClasses} text-gray-500 hover:bg-gray-200`;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-leaf text-green-600 text-2xl mr-2"></i>
              <h1 className="text-2xl font-bold text-gray-800">AgriConnect</h1>
            </div>
            {/* --- Desktop Nav Links --- */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/dashboard" className={getNavLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/categories" className={getNavLinkClass}>
                  Categories
                </NavLink>
                <NavLink to="/my-orders" className={getNavLinkClass}>
                  My Orders
                </NavLink>
              </div>
            </div>
          </div>
          {/* --- Desktop Buttons --- */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button 
                id="cart-button" 
                className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-blue-500 transition-colors"
                onClick={() => alert('Shopping cart feature is coming soon!')}
              >
                <i className="fas fa-shopping-cart"></i>
              </button>
              <button
                id="logout-button"
                onClick={handleLogout}
                className="ml-4 flex items-center text-gray-500 hover:text-white hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
          {/* --- 4. ADD Hamburger Button (Mobile Only) --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggles state
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-700"
            >
              {/* Icon changes based on state */}
              {isMenuOpen ? (
                <i className="fas fa-times fa-lg"></i> // 'X' icon
              ) : (
                <i className="fas fa-bars fa-lg"></i> // 'Bars' icon
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- 5. ADD Mobile Menu (Toggles) --- */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/dashboard" className={getMobileNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/categories" className={getMobileNavLinkClass}>
            Categories
          </NavLink>
          <NavLink to="/my-orders" className={getMobileNavLinkClass}>
            My Orders
          </NavLink>
        </div>
        {/* Mobile Logout Section */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <button 
              id="cart-button-mobile" 
              className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-blue-500 transition-colors"
              onClick={() => alert('Shopping cart feature is coming soon!')}
            >
              <i className="fas fa-shopping-cart"></i>
            </button>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center text-gray-500 hover:text-white hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default ConsumerNavbar;