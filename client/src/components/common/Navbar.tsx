import React, { useState } from 'react';
import { ShoppingCart, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { NavbarProps } from '../../types';

const Navbar: React.FC<NavbarProps> = ({ userType, setUserType, isLoggedIn, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/src/assets/logo/AgriLinkGREEN.png"
              alt="AgriLink Logo"
              className="w-16 h-16 object-contain transform hover:scale-105 transition-all"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/marketplace"
              className="text-gray-700 hover:text-[#5ba409] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]"
            >
              Marketplace
            </Link>
            <Link
              to="/map"
              className="text-gray-700 hover:text-[#5ba409] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]"
            >
              Maps
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#5ba409] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]"
            >
              About
            </Link>
            <div className="flex items-center space-x-3">
              <Link to="/cart" className="relative p-2 hover:bg-[#F9FBE7] rounded-full transition-colors block">
                <ShoppingCart className="w-6 h-6 text-[#5ba409]" />
                <span className="absolute -top-1 -right-1 bg-[#FFC107] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Link>
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-[#5ba409] border-2 border-[#5ba409] text-white hover:bg-white hover: border-[#5ba409] hover:text-[#5ba409] px-4 py-2 rounded-full font-semibold transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="border-2 border-[#5ba409] text-[#5ba409] hover:bg-[#5ba409] hover:text-white px-4 py-2 rounded-full font-semibold transition-colors"
                  >
                    Register
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l-2 border-gray-100">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-[#5ba409] transition-colors">
                    <div className="bg-green-100 p-2 rounded-full">
                      <UserIcon className="w-5 h-5 text-[#4CAF50]" />
                    </div>
                    <span className="font-bold capitalize">{userType}</span>
                  </Link>
                  <button
                    onClick={() => { onLogout(); navigate('/'); }}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-600 font-bold transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
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
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold block"
            >
              Maps
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-lg hober:bf-[#F9FBE7] font-semibold block"
            >
            </Link>
            {/* <Link
              to={userType === 'farmer' ? '/farmer-dashboard' : userType === 'admin' ? '/admin' : '/buyer-dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold block"
            >
              Dashboard
            </Link> */}

            {!isLoggedIn ? (
              <>
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
              </>
            ) : (
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); navigate('/'); }}
                className="w-full bg-red-50 text-red-500 border-2 border-red-500 py-3 rounded-lg font-bold flex items-center justify-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
