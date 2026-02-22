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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const location = useLocation();


  const handleLogin = (role: string) => {
    setUserType(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {

    setIsLoggedIn(false);
  };


  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>

      <Navbar
        currentPage={location.pathname}
        userType={userType}
        setUserType={setUserType}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />


      <RouteTransition>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/product-upload" element={<ProductUploadPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </RouteTransition>


      {/* Footer */}
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
