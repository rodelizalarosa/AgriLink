import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Components
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
import BuyerDashboard from './components/pages/Buyer/BuyerDashboard';
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
import CheckoutPage from './components/pages/Buyer/CheckoutPage';
import MapPage from './components/pages/MapPage';
import AboutPage from './components/pages/AboutPage';
import { ArrowUp } from 'lucide-react';
import BrgyDashboard from './components/pages/Brgy/BrgyDashboard';
import BrgyListingsPage from './components/pages/Brgy/BrgyListingsPage';
import BrgyAwardBadgePage from './components/pages/Brgy/BrgyAwardBadgePage';
import { ToastContainer } from './components/ui/Toast';
import OnboardingModal from './components/modals/OnboardingModal';
import type { FC } from 'react';

// Routes where the sidebar should be shown (farmer/admin/brgy/lgu only)
const SIDEBAR_ROUTES = [
  '/farmer/dashboard',
  '/farmer/listings',
  '/farmer/orders',
  '/farmer/upload',
  '/farmer/earnings',
  '/farmer/phenotyping',
  '/buyer/dashboard',
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
  '/notifications'
];

// Main App Component
const AppContent: React.FC = () => {
  const [userType, setUserType] = useState<string>('buyer');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);


  useEffect(() => {
    const handleOpenModal = () => setIsAddProductModalOpen(true);
    window.addEventListener('open-add-product', handleOpenModal);
    return () => window.removeEventListener('open-add-product', handleOpenModal);
  }, []);

  useEffect(() => {
    const handleOpenEditModal = (event: any) => {
      setEditingProduct(event.detail || null);
      setIsEditProductModalOpen(true);
    };
    window.addEventListener('open-edit-product', handleOpenEditModal as EventListener);
    return () => window.removeEventListener('open-edit-product', handleOpenEditModal as EventListener);
  }, []);

  // 📝 Dynamic Page Titles
  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      '/': 'AgriLink | Fresh Farm Produce',
      '/buyer/marketplace': 'Marketplace | AgriLink',
      '/farmer/dashboard': 'Farmer Dashboard | AgriLink',
      '/farmer/listings': 'My Listings | AgriLink',
      '/farmer/orders': 'Farmer Orders | AgriLink',
      '/buyer/dashboard': 'Dashboard | AgriLink',
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

    const currentTitle = routeTitles[location.pathname] || 'AgriLink';
    document.title = currentTitle;
  }, [location]);

  const sidebarVisibleRoles = ['farmer', 'admin', 'brgy_official'];
  const showSidebar = isLoggedIn && sidebarVisibleRoles.includes(userType.toLowerCase()) && SIDEBAR_ROUTES.includes(location.pathname);

  useEffect(() => {
    const savedRole = localStorage.getItem('agrilink_role');
    const savedLoggedIn = localStorage.getItem('agrilink_isLoggedIn');

    if (savedLoggedIn === 'true' && savedRole) {
      setUserType(savedRole);
      setFirstName(localStorage.getItem('agrilink_firstName') || '');
      setLastName(localStorage.getItem('agrilink_lastName') || '');
      setIsLoggedIn(true);
      const onboardingStatus = localStorage.getItem('agrilink_onboarding_completed');
      setOnboardingCompleted(onboardingStatus === '1');
      if ((savedRole.toLowerCase() === 'buyer' || savedRole.toLowerCase() === 'farmer') && onboardingStatus !== '1') {
        setShowOnboarding(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleCompletion = () => {
      setOnboardingCompleted(true);
      setShowOnboarding(false);
    };

    window.addEventListener('agrilink-onboarding-completed', handleCompletion);
    return () => window.removeEventListener('agrilink-onboarding-completed', handleCompletion);
  }, []);

  const handleLogin = (role: string, userData?: any, token?: string) => {
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
      localStorage.setItem('agrilink_id', userData.id || '');
      
      const onboardingStatus = userData.onboarding_completed === 1;
      setOnboardingCompleted(onboardingStatus);
      localStorage.setItem('agrilink_onboarding_completed', onboardingStatus ? '1' : '0');
      
      if ((sanitizedRole === 'buyer' || sanitizedRole === 'farmer') && !onboardingStatus) {
        setShowOnboarding(true);
      }
    }

    localStorage.setItem('agrilink_role', sanitizedRole);
    localStorage.setItem('agrilink_isLoggedIn', 'true');
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
  };

  // 🔒 RBAC Guard Component
  const RoleGuard = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
    if (!isLoggedIn) return <LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} userType={userType} />;
    if (!allowedRoles.includes(userType.toLowerCase())) {
      const dashMap: any = {
        'farmer': '/farmer/dashboard',
        'admin': '/admin/dashboard',
        'brgy_official': '/brgy/dashboard',
        'buyer': '/buyer/marketplace'
      };
      navigate(dashMap[userType.toLowerCase()] || '/');
      return null;
    }
    return <>{children}</>;
  };

  // 🔒 Guest Guard Component (Prevent logged-in users from accessing industrial pages)
  const GuestGuard = ({ children }: { children: React.ReactNode }) => {
    if (isLoggedIn) {
      const dashMap: any = {
        'farmer': '/farmer/dashboard',
        'admin': '/admin/dashboard',
        'brgy_official': '/brgy/dashboard',
        'buyer': '/buyer/marketplace'
      };
      navigate(dashMap[userType.toLowerCase()] || '/');
      return null;
    }
    return <>{children}</>;
  };

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
          onComplete={() => setOnboardingCompleted(true)}
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

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${showSidebar ? (sidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''
        }`}>
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
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<GuestGuard><LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} userType={userType} /></GuestGuard>} />
              <Route path="/register" element={<GuestGuard><RegisterPage onLogin={handleLogin} /></GuestGuard>} />

              {/* Protected-for-all Routes */}
              <Route path="/profile" element={isLoggedIn ? <ProfilePage userType={userType} /> : <LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} userType={userType} />} />
              <Route path="/messages" element={isLoggedIn ? <MessagesPage userType={userType} /> : <LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} userType={userType} />} />
              <Route path="/notifications" element={isLoggedIn ? <NotificationsPage userType={userType} /> : <LoginPage onLogin={handleLogin} isLoggedIn={isLoggedIn} userType={userType} />} />

              {/* Farmer Routes */}
              <Route path="/farmer/dashboard" element={<RoleGuard allowedRoles={['farmer']}><FarmerDashboard /></RoleGuard>} />
              <Route path="/farmer/listings" element={<RoleGuard allowedRoles={['farmer']}><FarmerListingsPage /></RoleGuard>} />
              <Route path="/farmer/orders" element={<RoleGuard allowedRoles={['farmer']}><FarmerOrdersPage /></RoleGuard>} />
              <Route path="/farmer/upload" element={<RoleGuard allowedRoles={['farmer']}><ProductUploadPage /></RoleGuard>} />
              <Route path="/farmer/earnings" element={<RoleGuard allowedRoles={['farmer']}><FarmerEarningsPage /></RoleGuard>} />
              <Route path="/farmer/phenotyping" element={<RoleGuard allowedRoles={['farmer']}><FarmerPhenotypingPage /></RoleGuard>} />
              <Route path="/farmer/edit-product/:id" element={<RoleGuard allowedRoles={['farmer']}><EditProductModalRoute /></RoleGuard>} />

              {/* Buyer Routes */}
              <Route path="/buyer/dashboard" element={<RoleGuard allowedRoles={['buyer']}><BuyerDashboard /></RoleGuard>} />
              <Route path="/buyer/marketplace" element={<MarketplacePage />} />
              <Route path="/buyer/product/:id" element={<ProductDetailPage />} />
              <Route path="/buyer/cart" element={<RoleGuard allowedRoles={['buyer']}><CartPage /></RoleGuard>} />
              <Route path="/buyer/checkout/:id" element={<RoleGuard allowedRoles={['buyer']}><CheckoutPage /></RoleGuard>} />
              <Route path="/buyer/map" element={<MapPage />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<RoleGuard allowedRoles={['admin']}><AdminDashboard /></RoleGuard>} />
              <Route path="/admin/users" element={<RoleGuard allowedRoles={['admin', 'brgy_official']}><AdminUsersPage viewerRole={userType} /></RoleGuard>} />
              <Route path="/admin/listings" element={<RoleGuard allowedRoles={['admin']}><AdminListingsPage /></RoleGuard>} />
              <Route path="/admin/orders" element={<RoleGuard allowedRoles={['admin']}><AdminOrdersPage /></RoleGuard>} />
              <Route path="/logs" element={<RoleGuard allowedRoles={['admin']}><LogsPage /></RoleGuard>} />

              {/* Brgy Routes */}
              <Route path="/brgy/dashboard" element={<RoleGuard allowedRoles={['brgy_official']}><BrgyDashboard /></RoleGuard>} />
              <Route path="/brgy/listings" element={<RoleGuard allowedRoles={['brgy_official']}><BrgyListingsPage /></RoleGuard>} />
              <Route path="/brgy/award-badge" element={<RoleGuard allowedRoles={['brgy_official']}><BrgyAwardBadgePage /></RoleGuard>} />
            </Routes>
          </RouteTransition>
        </main>


        {/* Footer - Only show if sidebar is NOT shown for a cleaner dashboard view */}
        {!showSidebar && (
          <footer className="bg-green-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <img
                      src="/src/assets/logo/AgriLinkWHITE.png"
                      alt="AgriLink Logo"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <p className="text-green-100">Connecting farmers and communities for fresh, sustainable produce.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-green-100">
                    <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors cursor-pointer">About Us</button></li>
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
                <p>© 2026 AgriLink. All rights reserved. 🌱</p>
              </div>
            </div>
          </footer>
        )}
      </div>

      <ScrollToTopButton />
      {/* 🚀 Global Farmer Modals */}
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

// 🚀 Standalone Scroll To Top Component to prevent re-renders
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

// Main App Component with Router
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
