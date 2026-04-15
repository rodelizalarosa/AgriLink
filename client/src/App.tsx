import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import RouteTransition from './components/ui/RouteTransition';
import LandingPage from './components/pages/LandingPage';
import MarketplacePage from './components/pages/MarketplacePage';
import FarmerDashboard from './components/pages/Farmer/FarmerDashboard';
import FarmerListingsPage from './components/pages/Farmer/FarmerListingsPage';
import FarmerOrdersPage from './components/pages/Farmer/FarmerOrdersPage';
import FarmerEarningsPage from './components/pages/Farmer/FarmerEarningsPage';
import FarmerPhenotypingPage from './components/pages/Farmer/FarmerPhenotypingPage';
import EditProductModalRoute from './components/pages/Farmer/EditProductModalRoute';
import AddProductModal from './components/pages/Farmer/AddProductModal';
import EditProductModal from './components/pages/Farmer/EditProductModal';
import ProductUploadPage from './components/pages/Farmer/ProductUploadPage';
import AdminDashboard from './components/pages/Admin/AdminDashboard';
import AdminUsersPage from './components/pages/Admin/AdminUsersPage';
import AdminListingsPage from './components/pages/Admin/AdminListingsPage';
import AdminOrdersPage from './components/pages/Admin/AdminOrdersPage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import LogsPage from './components/pages/LogsPage';
import MessagesPage from './components/pages/MessagesPage';
import NotificationsPage from './components/pages/NotificationsPage';
import ProductDetailPage from './components/pages/Buyer/ProductDetailPage';
import CartPage from './components/pages/Buyer/CartPage';
import MapPage from './components/pages/MapPage';
import AboutPage from './components/pages/AboutPage';
import BrgyDashboard from './components/pages/Brgy/BrgyDashboard';
import BrgyListingsPage from './components/pages/Brgy/BrgyListingsPage';
import BrgyAwardBadgePage from './components/pages/Brgy/BrgyAwardBadgePage';
import OnboardingModal from './components/modals/OnboardingModal';
import { ArrowUp } from 'lucide-react';
import { ToastContainer } from './components/ui/Toast';
import { MessagingProvider } from './contexts/MessagingContext';
import { NotificationProvider } from './contexts/NotificationContext';

const SIDEBAR_ROUTES = [
  '/farmer/dashboard',
  '/farmer/listings',
  '/farmer/orders',
  '/farmer/upload',
  '/farmer/earnings',
  '/farmer/phenotyping',
  '/admin/dashboard',
  '/brgy/dashboard',
  '/brgy/listings',
  '/brgy/award-badge',
  '/admin/users',
  '/admin/listings',
  '/admin/orders',
  '/buyer/marketplace',
  '/profile',
  '/logs',
  '/buyer/cart',
  '/buyer/map',
  '/messages',
  '/notifications',
];

interface EditableProduct {
  p_id?: string | number;
  [key: string]: unknown;
}

interface LoginUserData {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  onboarding_completed?: number | boolean;
}

const getHomeRoute = (role: string) => {
  const normalized = role.toLowerCase();
  if (normalized === 'farmer') return '/farmer/dashboard';
  if (normalized === 'admin') return '/admin/dashboard';
  if (normalized === 'brgy_official') return '/brgy/dashboard';
  return '/buyer/marketplace';
};

const AppContent: React.FC = () => {
  const initialRole = localStorage.getItem('agrilink_role') || 'buyer';
  const initialLoggedIn =
    localStorage.getItem('agrilink_isLoggedIn') === 'true' ||
    !!localStorage.getItem('agrilink_token') ||
    !!localStorage.getItem('agrilink_id');
  const initialOnboardingCompleted = localStorage.getItem('agrilink_onboarding_completed') === '1';

  const [userType, setUserType] = useState<string>(initialRole);
  const [firstName, setFirstName] = useState<string>(localStorage.getItem('agrilink_firstName') || '');
  const [lastName, setLastName] = useState<string>(localStorage.getItem('agrilink_lastName') || '');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialLoggedIn);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    initialLoggedIn &&
      (initialRole.toLowerCase() === 'buyer' || initialRole.toLowerCase() === 'farmer') &&
      !initialOnboardingCompleted
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpenModal = () => setIsAddProductModalOpen(true);
    window.addEventListener('open-add-product', handleOpenModal);
    return () => window.removeEventListener('open-add-product', handleOpenModal);
  }, []);

  useEffect(() => {
    const handleOpenEditModal = (event: Event) => {
      const customEvent = event as CustomEvent<EditableProduct>;
      setEditingProduct(customEvent.detail || null);
      setIsEditProductModalOpen(true);
    };
    window.addEventListener('open-edit-product', handleOpenEditModal as EventListener);
    return () => window.removeEventListener('open-edit-product', handleOpenEditModal as EventListener);
  }, []);

  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      '/': 'AgriLink | Fresh Farm Produce',
      '/buyer/marketplace': 'Marketplace | AgriLink',
      '/farmer/dashboard': 'Farmer Dashboard | AgriLink',
      '/farmer/listings': 'My Listings | AgriLink',
      '/farmer/orders': 'Farmer Orders | AgriLink',
      '/buyer/dashboard': 'My Profile | AgriLink',
      '/farmer/upload': 'Upload Product | AgriLink',
      '/admin/dashboard': 'Admin Dashboard | AgriLink',
      '/brgy/dashboard': 'Barangay Dashboard | AgriLink',
      '/brgy/listings': 'Barangay Listings | AgriLink',
      '/brgy/award-badge': 'Award Trust Badge | AgriLink',
      '/lgu-dashboard': 'LGU Dashboard | AgriLink',
      '/admin/users': 'Manage Users | AgriLink',
      '/admin/listings': 'Manage Listings | AgriLink',
      '/admin/orders': 'Manage Orders | AgriLink',
      '/login': 'Login | AgriLink',
      '/register': 'Join AgriLink | Register',
      '/profile': 'My Profile | AgriLink',
      '/logs': 'Activity Logs | AgriLink',
      '/buyer/cart': 'Shopping Basket | AgriLink',
      '/buyer/checkout': 'Checkout | AgriLink',
      '/buyer/map': 'Farmer Locations | AgriLink',
      '/messages': 'Messages | AgriLink',
      '/notifications': 'Activities | AgriLink',
      '/about': 'About Us | AgriLink',
    };

    document.title = routeTitles[location.pathname] || 'AgriLink';
  }, [location.pathname]);

  useEffect(() => {
    const handleCompletion = () => {
      setShowOnboarding(false);
    };

    window.addEventListener('agrilink-onboarding-completed', handleCompletion);
    return () => window.removeEventListener('agrilink-onboarding-completed', handleCompletion);
  }, []);

  const handleLogin = (role: string, userData?: LoginUserData, token?: string) => {
    const sanitizedRole = role.toLowerCase();
    setUserType(sanitizedRole);
    setIsLoggedIn(true);

    if (token) {
      localStorage.setItem('agrilink_token', token);
    }

    if (userData) {
      setFirstName(userData.first_name || '');
      setLastName(userData.last_name || '');
      localStorage.setItem('agrilink_firstName', userData.first_name || '');
      localStorage.setItem('agrilink_lastName', userData.last_name || '');
      localStorage.setItem('agrilink_id', String(userData.id || ''));

      const onboardingStatus = userData.onboarding_completed === 1;
      localStorage.setItem('agrilink_onboarding_completed', onboardingStatus ? '1' : '0');

      if ((sanitizedRole === 'buyer' || sanitizedRole === 'farmer') && !onboardingStatus) {
        setShowOnboarding(true);
      }
    }

    localStorage.setItem('agrilink_role', sanitizedRole);
    localStorage.setItem('agrilink_isLoggedIn', 'true');
    window.dispatchEvent(new Event('agrilink-auth-changed'));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setFirstName('');
    setLastName('');
    localStorage.removeItem('agrilink_role');
    localStorage.removeItem('agrilink_isLoggedIn');
    localStorage.removeItem('agrilink_user');
    localStorage.removeItem('agrilink_firstName');
    localStorage.removeItem('agrilink_lastName');
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_id');
    localStorage.removeItem('agrilink_onboarding_completed');
    setShowOnboarding(false);
    navigate('/login');
    window.dispatchEvent(new Event('agrilink-auth-changed'));
  };

  const homeRoute = getHomeRoute(userType);
  const hasRole = (allowedRoles: string[]) => allowedRoles.includes(userType.toLowerCase());

  const sidebarVisibleRoles = ['farmer', 'admin', 'brgy_official'];
  const showSidebar =
    isLoggedIn &&
    sidebarVisibleRoles.includes(userType.toLowerCase()) &&
    SIDEBAR_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      <ToastContainer />

      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          userId={localStorage.getItem('agrilink_id') || ''}
          userName={firstName}
          userType={userType}
          onComplete={() => setShowOnboarding(false)}
        />
      )}

      {showSidebar && (
        <Sidebar
          userType={userType}
          firstName={firstName}
          lastName={lastName}
          setUserType={setUserType}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
        />
      )}

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${showSidebar ? (sidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''}`}>
        {!showSidebar && (
          <Navbar
            currentPage={location.pathname}
            userType={userType}
            firstName={firstName}
            lastName={lastName}
            setUserType={setUserType}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
        )}

        <main className={`flex-1 ${!showSidebar ? 'pt-20' : ''}`}>
          <RouteTransition>
            <Routes>
              <Route path="/" element={isLoggedIn ? <Navigate to={homeRoute} replace /> : <LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/login"
                element={
                  isLoggedIn ? <Navigate to={homeRoute} replace /> : <LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} userType={userType} />
                }
              />
              <Route path="/register" element={isLoggedIn ? <Navigate to={homeRoute} replace /> : <RegisterPage onLogin={handleLogin} />} />

              <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />} />
              <Route path="/messages" element={isLoggedIn ? <MessagesPage userType={userType} /> : <Navigate to="/login" replace />} />
              <Route path="/notifications" element={isLoggedIn ? <NotificationsPage userType={userType} /> : <Navigate to="/login" replace />} />

              <Route path="/farmer/dashboard" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['farmer']) ? <FarmerDashboard /> : <Navigate to={homeRoute} replace />} />
              <Route path="/farmer/listings" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['farmer']) ? <FarmerListingsPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/farmer/orders" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['farmer']) ? <FarmerOrdersPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/farmer/upload" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['farmer']) ? <ProductUploadPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/farmer/earnings" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['farmer']) ? <FarmerEarningsPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/farmer/phenotyping" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['farmer']) ? <FarmerPhenotypingPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/farmer/edit-product/:id" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['farmer']) ? <EditProductModalRoute /> : <Navigate to={homeRoute} replace />} />

              <Route path="/buyer/dashboard" element={<Navigate to="/profile" replace />} />
              <Route path="/buyer/marketplace" element={<MarketplacePage />} />
              <Route path="/buyer/product/:id" element={<ProductDetailPage />} />
              <Route path="/buyer/cart" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['buyer']) ? <CartPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/buyer/checkout/:id" element={<Navigate to="/profile?tab=market" replace />} />
              <Route path="/buyer/map" element={<MapPage />} />

              <Route path="/admin/dashboard" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['admin']) ? <AdminDashboard /> : <Navigate to={homeRoute} replace />} />
              <Route path="/admin/users" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['admin', 'brgy_official']) ? <AdminUsersPage viewerRole={userType} /> : <Navigate to={homeRoute} replace />} />
              <Route path="/admin/listings" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['admin']) ? <AdminListingsPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/admin/orders" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['admin']) ? <AdminOrdersPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/logs" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['admin']) ? <LogsPage /> : <Navigate to={homeRoute} replace />} />

              <Route path="/brgy/dashboard" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['brgy_official']) ? <BrgyDashboard /> : <Navigate to={homeRoute} replace />} />
              <Route path="/brgy/listings" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['brgy_official']) ? <BrgyListingsPage /> : <Navigate to={homeRoute} replace />} />
              <Route path="/brgy/award-badge" element={!isLoggedIn ? <Navigate to="/login" replace /> : hasRole(['brgy_official']) ? <BrgyAwardBadgePage /> : <Navigate to={homeRoute} replace />} />
            </Routes>
          </RouteTransition>
        </main>

        {!showSidebar && (
          <footer className="bg-green-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <img src="/src/assets/logo/AgriLinkWHITE.png" alt="AgriLink Logo" className="w-24 h-24 object-contain" />
                  </div>
                  <p className="text-green-100">Connecting farmers and communities for fresh, sustainable produce.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-green-100">
                    <li>
                      <button onClick={() => navigate('/about')} className="hover:text-white transition-colors cursor-pointer">About Us</button>
                    </li>
                    <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-4">Contact</h4>
                  <p className="text-green-100">Email: support@agrilink.ph</p>
                  <p className="text-green-100">Phone: +63 123 456 7890</p>
                </div>
              </div>
              <div className="border-t border-green-600 mt-8 pt-8 text-center text-green-100">
                <p>© 2026 AgriLink. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}
      </div>

      <ScrollToTopButton />

      {userType.toLowerCase() === 'farmer' && (
        <>
          <AddProductModal
            isOpen={isAddProductModalOpen}
            onClose={() => setIsAddProductModalOpen(false)}
            onSuccess={() => {
              window.dispatchEvent(new CustomEvent('product-added'));
            }}
          />
          <EditProductModal
            isOpen={isEditProductModalOpen}
            productId={editingProduct?.p_id?.toString()}
            initialProduct={editingProduct}
            onClose={() => {
              setIsEditProductModalOpen(false);
              setEditingProduct(null);
            }}
            onSuccess={() => {
              window.dispatchEvent(new CustomEvent('product-updated'));
            }}
          />
        </>
      )}
    </div>
  );
};

const ScrollToTopButton: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-10 right-10 z-[100] bg-[#5ba409] text-white p-4 rounded-2xl shadow-2xl hover:bg-black hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 active:scale-95 group"
    >
      <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
    </button>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <MessagingProvider>
          <AppContent />
        </MessagingProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App;

