import React, { useState, useEffect } from 'react'; // 1. IMPORT hooks
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 2. IMPORT axios

// 3. REMOVED the static 'initialOrders' data

// We can keep this config object to style our status badges
const statusConfig = {
  Processing: { text: 'Processing', class: 'bg-blue-100 text-blue-800' },
  Shipped: { text: 'Shipped', class: 'bg-yellow-100 text-yellow-800' },
  Delivered: { text: 'Delivered', class: 'bg-green-100 text-green-800' },
};

function OrdersPage() {
  const navigate = useNavigate();
  // 4. ADD state for orders
  const [orders, setOrders] = useState([]);

  // 5. UPDATE Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || localStorage.getItem('userType') !== 'Producer') {
      alert('Access Denied. Please log in as a Producer to view this page.');
      navigate('/');
    }
  }, [navigate]);

  // 6. ADD useEffect to fetch incoming orders
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/producer-orders`, config);
        // Sort by newest first
        setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchOrders();
  }, []); // [] runs once on page load

  // 7. ADD the function to handle status updates
  const handleStatusUpdate = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      // Call the PUT endpoint
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        { status: newStatus }, // Send the new status in the body
        config
      );

      // Update the state locally to see the change instantly
      setOrders(currentOrders =>
        currentOrders.map(order =>
          order._id === orderId ? res.data : order
        )
      );
      alert('Order status updated!');

    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // 8. HELPER function to decide what the button should do
  const getNextAction = (status) => {
    if (status === 'Processing') {
      return { text: 'Mark as Shipped', nextStatus: 'Shipped', disabled: false };
    }
    if (status === 'Shipped') {
      return { text: 'Mark as Delivered', nextStatus: 'Delivered', disabled: false };
    }
    if (status === 'Delivered') {
      return { text: 'Completed', nextStatus: null, disabled: true };
    }
    return { text: '', nextStatus: null, disabled: true };
  };

  return (
    <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
      <div className="px-4 md:px-0 fade-in">
        <h1 className="text-3xl font-extrabold text-gray-900">Incoming Orders</h1>
        <p className="mt-2 text-md text-gray-600">Manage and fulfill orders from your customers.</p>
      </div>

      <div className="mt-8 flex flex-col fade-in" style={{ '--delay': '200ms' }}>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow-lg overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                {/* 9. UPDATE table body to map 'orders' state */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => {
                      const statusInfo = statusConfig[order.status];
                      const action = getNextAction(order.status);
                      
                      return (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">...{order._id.slice(-6)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {order.productDetails.name} ({order.productDetails.quantity})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleStatusUpdate(order._id, action.nextStatus)}
                              className={`action-link ${action.disabled ? 'disabled' : 'text-green-600 hover:text-green-800'}`}
                              disabled={action.disabled}
                            >
                              {action.text}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-gray-500 py-6">
                        You have no incoming orders.
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

export default OrdersPage;