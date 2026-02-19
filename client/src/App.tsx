import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { VerifyEmailPage } from '../src/components/pages/ConfirmEmail';
import { ProtectedRoute } from '../src/components/ProtectedRoute'


// Components
import Navbar from './components/common/Navbar';
import LandingPage from './components/pages/LandingPage';
import MarketplacePage from './components/pages/MarketplacePage';
import FarmerDashboard from './components/pages/FarmerDashboard';
import BuyerDashboard from './components/pages/BuyerDashboard';
import ProductUploadPage from './components/pages/ProductUploadPage';
import AdminPanel from './components/pages/AdminPanel';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';

// Main App Component
const AppContent: React.FC = () => {
  const [userType, setUserType] = useState<string>('buyer');
  const location = useLocation();

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
      />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />

        <Route path="/farmer-dashboard" element={
          <ProtectedRoute allowedRoles={[2]}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/buyer-dashboard" element={
          <ProtectedRoute allowedRoles={[1]}>
            <BuyerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/product-upload" element={
          <ProtectedRoute allowedRoles={[2]}>
            <ProductUploadPage />
          </ProtectedRoute>
        } />

        <Route path="/lgu-dashboard" element={
        <ProtectedRoute allowedRoles={[3]}>
          {/* <LguDashboard /> */} 
          <BuyerDashboard />
        </ProtectedRoute>
      } />

      <Route path="/brgy-dashboard" element={
        <ProtectedRoute allowedRoles={[4]}>
          {/* <BrgyDashboard /> */}
          <BuyerDashboard />
        </ProtectedRoute>
      } />

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
      
      
      {/* Footer */}
      <footer className="bg-[#2E7D32] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Leaf className="w-8 h-8 mr-2" />
                <h3 className="text-2xl font-bold">AgriLink</h3>
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
