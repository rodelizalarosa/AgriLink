import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import RouteTransition from './components/ui/RouteTransition';
import LandingPage from './components/pages/LandingPage';
import MarketplacePage from './components/pages/MarketplacePage';
import FarmerDashboard from './components/pages/FarmerDashboard';
import BuyerDashboard from './components/pages/BuyerDashboard';
import ProductUploadPage from './components/pages/ProductUploadPage';
import AdminPanel from './components/pages/AdminPanel';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';

// Routes where the sidebar should be shown (farmer/admin only)
const SIDEBAR_ROUTES = ['/farmer-dashboard', '/product-upload', '/buyer-dashboard', '/admin'];

// Main App Component
const AppContent: React.FC = () => {
  const [userType, setUserType] = useState<string>('buyer');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const location = useLocation();

  // Page title
  useEffect(() => {
    const PageTitles: Record<string, string> = {
      '/': 'AgriLink - Home',
      '/marketplace': 'AgriLink - Marketplace',
      '/farmer-dashboard': 'AgriLink - Farmer Dashboard',
      '/buyer-dashboard': 'AgriLink - Buyer Dashboard',
      '/product-upload': 'AgriLink - Product Upload',
      '/admin': 'AgriLink - Admin Panel',
      '/login': 'AgriLink - Login',
      '/register': 'AgriLink - Register',
    };
    document.title = PageTitles[location.pathname] || 'AgriLink - Home';
  }, [location.pathname]);

  // Determine if we should show the sidebar
  const showSidebar =
    (userType === 'farmer' || userType === 'admin') &&
    SIDEBAR_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Sidebar (farmer / admin dashboard pages) ── */}
      {showSidebar && (
        <Sidebar
          userType={userType as 'farmer' | 'admin'}
          setUserType={setUserType}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar shown only on public pages */}
        {!showSidebar && (
          <Navbar
            currentPage={location.pathname}
            userType={userType}
            setUserType={setUserType}
          />
        )}

        <RouteTransition>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/product-upload" element={<ProductUploadPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </RouteTransition>

        {/* Footer — shown only on public pages */}
        {!showSidebar && (
          <footer className="bg-[#2E7D32] text-white py-12 mt-20">
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
                    <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
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
