import { Routes, Route } from 'react-router-dom';
import ConsumerLayout from './layouts/ConsumerLayout';
import ProducerLayout from './layouts/ProducerLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Consumer Pages
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import CategoriesPage from './pages/consumer/CategoriesPage';
import MyOrdersPage from './pages/consumer/MyOrdersPage';
import ProductDetailPage from './pages/consumer/ProductDetailPage';

// Producer Pages
import ProducerDashboard from './pages/producer/ProducerDashboard';
import AddProductPage from './pages/producer/AddProductPage';
import OrdersPage from './pages/producer/OrdersPage';
import ContactPage from './pages/producer/ContactPage';

function App() {
  return (
    <Routes>
      {/* Auth Routes (no layout) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Consumer Routes (all use ConsumerLayout) */}
      <Route element={<ConsumerLayout />}>
        <Route path="/dashboard" element={<ConsumerDashboard />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
      </Route>

      {/* Producer Routes (all use ProducerLayout) */}
      <Route element={<ProducerLayout />}>
        <Route path="/producer/dashboard" element={<ProducerDashboard />} />
        <Route path="/producer/add-product" element={<AddProductPage />} />
        <Route path="/producer/orders" element={<OrdersPage />} />
        <Route path="/producer/contact" element={<ContactPage />} />
      </Route>
      
      {/* TODO: Add a 404 Not Found page */}
    </Routes>
  );
}

export default App;