import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { NavbarProps } from '../../types';

const Navbar: React.FC<NavbarProps> = ({ userType, setUserType }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-[#4CAF50] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] p-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-[#2E7D32] tracking-tight">AgriLink</h1>
              <p className="text-xs text-[#8D6E63] font-medium">Farm to Table</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-[#4CAF50] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]"
            >
              Marketplace
            </Link>
            <Link
              to={userType === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'}
              className="text-gray-700 hover:text-[#4CAF50] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]"
            >
              Dashboard
            </Link>
            {userType === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-[#4CAF50] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]"
              >
                Admin
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <button className="relative p-2 hover:bg-[#F9FBE7] rounded-full transition-colors">
                <ShoppingCart className="w-6 h-6 text-[#4CAF50]" />
                <span className="absolute -top-1 -right-1 bg-[#FFC107] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <div className="relative">
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="appearance-none bg-[#4CAF50] text-white px-4 py-2 pr-8 rounded-full font-semibold cursor-pointer hover:bg-[#45A049] transition-colors"
                >
                  <option value="buyer">Buyer</option>
                  <option value="farmer">Farmer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#4CAF50] border-2 border-[#4CAF50] hover:bg-[#45A049] hover:border-[#4CAF50] text-white px-4 py-2 rounded-full font-semibold transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white px-4 py-2 rounded-full font-semibold transition-colors"
              >
                Register
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[#F9FBE7]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold block"
            >
              Marketplace
            </Link>
            <Link
              to={userType === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold block"
            >
              Dashboard
            </Link>
            <button
              onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              className="w-full bg-[#4CAF50] border-2 border-[#4CAF50] hover:bg-[#45A049] hover:border-[#4CAF50] text-white px-4 py-3 rounded-lg font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
              className="w-full border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white px-4 py-3 rounded-lg font-semibold"
            >
              Register
            </button>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full bg-[#4CAF50] border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white px-4 py-3 rounded-lg font-semibold"
            >
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
