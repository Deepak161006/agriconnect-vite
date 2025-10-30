import React, { useState, useEffect } from 'react'; // 1. IMPORT hooks
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 2. IMPORT axios

// 3. We'll create this config object to style the badges
const statusConfig = {
  Processing: { text: 'Processing', class: 'bg-blue-100 text-blue-800' },
  Shipped: { text: 'Shipped', class: 'bg-yellow-100 text-yellow-800' },
  Delivered: { text: 'Delivered', class: 'bg-green-100 text-green-800' },
};

function MyOrdersPage() {
  const navigate = useNavigate();
  // 4. ADD state to hold the orders
  const [orders, setOrders] = useState([]);

  // 5. UPDATE Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Consumer') {
      alert('Access Denied. Please log in as a Consumer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // 6. ADD useEffect to fetch the user's orders
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
        // Sort by newest first
        setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchMyOrders();
  }, []); // [] runs once on page load

  // 7. UPDATE "View Details" to an alert
  const handleViewDetails = (order) => {
    alert(
      `Order Details:\n\n` +
      `Order ID: ...${order._id.slice(-6)}\n` +
      `Product: ${order.productDetails.name} (${order.productDetails.quantity})\n` +
      `Farmer: ${order.producer.fullName}\n` +
      `Status: ${order.status}`
    );
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
                {/* 8. UPDATE table body to map 'orders' state */}
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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