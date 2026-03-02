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
import MapPage from './components/pages/Buyer/MapPage';
import AboutPage from './components/pages/AboutPage';
import { ArrowUp } from 'lucide-react';
import BrgyDashboard from './components/pages/Brgy/BrgyDashboard';
import BrgyListingsPage from './components/pages/Brgy/BrgyListingsPage';
import BrgyAwardBadgePage from './components/pages/Brgy/BrgyAwardBadgePage';

// Routes where the sidebar should be shown (farmer/admin/brgy/lgu only)
const SIDEBAR_ROUTES = [
  '/farmer-dashboard', 
  '/farmer-listings', 
  '/farmer-orders', 
  '/product-upload', 
  '/buyer-dashboard', 
  '/admin-dashboard',
  '/brgy-dashboard',
  '/brgy-listings',
  '/brgy-award-badge',
  '/admin-users',
  '/admin-listings',
  '/admin-orders',
  '/marketplace',
  '/profile',
  '/logs',
  '/cart',
  '/map',
  '/messages',
  '/notifications'
];

// Main App Component
const AppContent: React.FC = () => {
  const [userType, setUserType] = useState<string>('buyer');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 📝 Dynamic Page Titles
  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      '/': 'AgriLink | Fresh Farm Produce',
      '/marketplace': 'Marketplace | AgriLink',
      '/farmer-dashboard': 'Farmer Dashboard | AgriLink',
      '/farmer-listings': 'My Listings | AgriLink',
      '/farmer-orders': 'Farmer Orders | AgriLink',
      '/buyer-dashboard': 'Dashboard | AgriLink',
      '/product-upload': 'Upload Product | AgriLink',
      '/admin-dashboard': 'Admin Dashboard | AgriLink',
      '/brgy-dashboard': 'Barangay Dashboard | AgriLink',
      '/brgy-listings': 'Barangay Listings | AgriLink',
      '/brgy-award-badge': 'Award Trust Badge | AgriLink',
      '/lgu-dashboard': 'LGU Dashboard | AgriLink',
      '/admin-users': 'Manage Users | AgriLink',
      '/admin-listings': 'Manage Listings | AgriLink',
      '/admin-orders': 'Manage Orders | AgriLink',
      '/login': 'Login | AgriLink',
      '/register': 'Join AgriLink | Register',
      '/profile': 'My Profile | AgriLink',
      '/logs': 'Activity Logs | AgriLink',
      '/cart': 'Shopping Basket | AgriLink',
      '/checkout': 'Checkout | AgriLink',
      '/map': 'Farmer Locations | AgriLink',
      '/messages': 'Messages | AgriLink',
      '/notifications': 'Activities | AgriLink',
      '/about': 'About Us | AgriLink',
    };

    const currentTitle = routeTitles[location.pathname] || 'AgriLink';
    document.title = currentTitle;
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const sidebarVisibleRoles = ['farmer', 'admin', 'brgy_official'];
  const showSidebar = isLoggedIn && sidebarVisibleRoles.includes(userType.toLowerCase()) && SIDEBAR_ROUTES.includes(location.pathname);

  const handleLogin = (role: string) => {
    setUserType(role.toLowerCase());
    setIsLoggedIn(true);
  };

  const handleLogout = () => {

    setIsLoggedIn(false);
  };


  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      {showSidebar && (
        <Sidebar
          userType={userType}
          setUserType={setUserType}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onLogout={handleLogout}
        />
      )}

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        showSidebar ? (sidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''
      }`}>
        {!showSidebar && (
          <Navbar
            currentPage={location.pathname}
            userType={userType}
            setUserType={setUserType}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
        )}


        <main className={`flex-1 ${!showSidebar ? 'pt-20' : ''}`}>
          <RouteTransition>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer-listings" element={<FarmerListingsPage />} />
              <Route path="/farmer-orders" element={<FarmerOrdersPage />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/product-upload" element={<ProductUploadPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/brgy-dashboard" element={<BrgyDashboard />} />
              <Route path="/brgy-listings" element={<BrgyListingsPage />} />
              <Route path="/brgy-award-badge" element={<BrgyAwardBadgePage />} />
              <Route path="/admin-users" element={<AdminUsersPage viewerRole={userType} />} />
              <Route path="/admin-listings" element={<AdminListingsPage />} />
              <Route path="/admin-orders" element={<AdminOrdersPage />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

              <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
              <Route path="/profile" element={<ProfilePage userType={userType} />} />
              <Route path="/profile/:id" element={<ProfilePage userType={userType} />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout/:id" element={<CheckoutPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/messages" element={<MessagesPage userType={userType} />} />
              <Route path="/notifications" element={<NotificationsPage userType={userType} />} />
              <Route path="/about" element={<AboutPage />} />
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

      {/* 🚀 Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[100] bg-[#5ba409] text-white p-4 rounded-2xl shadow-2xl hover:bg-black hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 active:scale-95 group"
        >
          <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
        </button>
      )}
    </div>
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
