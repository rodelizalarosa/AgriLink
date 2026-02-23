import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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

// Routes where the sidebar should be shown (farmer/admin only)
const SIDEBAR_ROUTES = [
  '/farmer-dashboard', 
  '/farmer-listings', 
  '/farmer-orders', 
  '/product-upload', 
  '/buyer-dashboard', 
  '/admin-dashboard',
  '/admin-users',
  '/admin-listings',
  '/admin-orders',
  '/marketplace',
  '/profile'
];

// Main App Component
const AppContent: React.FC = () => {
  const [userType, setUserType] = useState<string>('buyer');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const showSidebar = isLoggedIn && (userType.toLowerCase() === 'farmer' || userType.toLowerCase() === 'admin') && SIDEBAR_ROUTES.includes(location.pathname);

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


        <main className="flex-1">
          <RouteTransition>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer-listings" element={<FarmerListingsPage />} />
              <Route path="/farmer-orders" element={<FarmerOrdersPage />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/product-upload" element={<ProductUploadPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-users" element={<AdminUsersPage />} />
              <Route path="/admin-listings" element={<AdminListingsPage />} />
              <Route path="/admin-orders" element={<AdminOrdersPage />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage userType={userType} />} />
            </Routes>
          </RouteTransition>
        </main>


        {/* Footer - Only show if sidebar is NOT shown for a cleaner dashboard view */}
        {!showSidebar && (
          <footer className="bg-green-800 text-white py-12 mt-20">
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
