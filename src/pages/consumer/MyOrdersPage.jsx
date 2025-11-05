import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusConfig = {
  Processing: { text: 'Processing', class: 'bg-blue-100 text-blue-800' },
  Shipped: { text: 'Shipped', class: 'bg-yellow-100 text-yellow-800' },
  Delivered: { text: 'Delivered', class: 'bg-green-100 text-green-800' },
};

function MyOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Consumer') {
      alert('Access Denied. Please log in as a Consumer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // Fetch Consumer's Orders
  useEffect(() => {
    const fetchMyOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, config);
        setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchMyOrders();
  }, []);

  // View Details
  const handleViewDetails = (order) => {
    alert(
      `Order Details:\n\n` +
      `Order ID: ...${order._id.slice(-6)}\n` +
      `Product: ${order.productDetails.name} (${order.productDetails.quantity})\n` +
      `Farmer: ${order.producer.fullName}\n` +
      `Status: ${order.status}`
    );
  };

  // --- NEW: Cancel Order Handler ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, config);
      
      // Update state to remove the order instantly
      setOrders(currentOrders => 
        currentOrders.filter(order => order._id !== orderId)
      );
      alert('Order cancelled successfully.');
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg : 'Please try again.';
      alert(`Failed to cancel order: ${errorMsg}`);
      console.error('Failed to cancel order:', errorMsg);
    }
  };


  return (
    <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
      <div className="px-4 md:px-0 fade-in">
        <h1 className="text-3xl font-extrabold text-gray-900">Your Order History</h1>
        <p className="mt-2 text-md text-gray-600">View and track your past and current orders.</p>
      </div>

      <div className="mt-8 flex flex-col fade-in" style={{ '--delay': '200ms' }}>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow-lg overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => {
                      const statusInfo = statusConfig[order.status] || { text: 'Unknown', class: 'bg-gray-100 text-gray-800' };
                      
                      return (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">...{order._id.slice(-6)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                            {order.productDetails.name}
                          </td>

                          {/* --- UPDATED: Actions Cell --- */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            
                            {/* Only show "Cancel" if the order is "Processing" */}
                            {order.status === 'Processing' && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="text-red-600 hover:text-red-800 transition-colors mr-4"
                              >
                                Cancel Order
                              </button>
                            )}

                            <button
                              onClick={() => handleViewDetails(order)}
                              className="view-details-btn text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500 py-6">
                        You haven't placed any orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MyOrdersPage;