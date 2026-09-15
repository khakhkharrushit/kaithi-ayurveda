import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import FeedbackModal from './components/FeedbackModal';
import Footer from './components/Footer';

import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function MainApp() {
  const { user, openAuthModal } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackOrderNumber, setFeedbackOrderNumber] = useState('');

  // Detect ?feedback=1 in URL (e.g. from email link)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('feedback') === '1') {
        const orderParam = params.get('order') || '';
        setFeedbackOrderNumber(orderParam);
        setFeedbackOpen(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Reset page and sensitive order details when user logs out
  React.useEffect(() => {
    if (!user) {
      setActiveOrder(null);
      // Always go home on sign-out so checkout form state is never visible
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentPage === 'admin' && user.role !== 'admin') {
      // A regular (non-admin) customer signed in while on the admin page → send them home
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user, currentPage]);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    setCurrentPage('product_detail');
  };

  const handleStartCheckout = () => {
    if (!user) {
      openAuthModal('login', 'Please sign in or create an account to proceed to checkout.', () => {
        setCurrentPage('checkout');
      });
      return;
    }
    setCurrentPage('checkout');
  };

  const handleOrderSuccess = (order) => {
    setActiveOrder(order);
    setCurrentPage('order_success');
  };

  const handleViewInvoice = (order) => {
    setActiveOrder(order);
    setCurrentPage('order_success');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onNavigate={navigateTo}
        currentPage={currentPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CartDrawer onCheckout={handleStartCheckout} />
      <AuthModal />
      <FeedbackModal
        isOpen={feedbackOpen}
        orderNumber={feedbackOrderNumber}
        onClose={() => {
          setFeedbackOpen(false);
          try {
            if (window.history.replaceState) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } catch (e) {}
        }}
      />

      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            searchQuery={searchQuery}
            onCheckout={handleStartCheckout}
          />
        )}

        {currentPage === 'product_detail' && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => navigateTo('home')}
            onCheckout={handleStartCheckout}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            key={user?.id ?? 'guest'}
            onBack={() => navigateTo('home')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'order_success' && (
          <OrderSuccessPage
            order={activeOrder}
            onContinueShopping={() => navigateTo('home')}
            onLeaveFeedback={(ordNum) => {
              setFeedbackOrderNumber(ordNum || activeOrder?.order_number || '');
              setFeedbackOpen(true);
            }}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            onViewOrderInvoice={handleViewInvoice}
            onContinueShopping={() => navigateTo('home')}
            onLeaveFeedback={(ordNum) => {
              setFeedbackOrderNumber(ordNum || '');
              setFeedbackOpen(true);
            }}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            onViewOrderInvoice={handleViewInvoice}
            onBackToStore={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Hide footer on clean printable invoice or during active checkout to minimize distraction */}
      {currentPage !== 'checkout' && (
        <Footer onNavigate={navigateTo} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
