import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Plus,
  ShoppingCart,
  Users,
  ClipboardList,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
} from 'lucide-react';
import type { SidebarProps } from '../../types';

// ─── Nav config ─────────────────────────────────────────────────────────────

const farmerNav = [
  { label: 'Dashboard',    icon: LayoutDashboard, to: '/farmer-dashboard' },
  { label: 'My Listings',  icon: Package,         to: '/farmer-listings'  },
  { label: 'Add Product',  icon: Plus,            to: '/product-upload'   },
  { label: 'Orders',       icon: ShoppingCart,    to: '/farmer-orders'    },
  { label: 'Profile',      icon: User,            to: '/profile'          },
];

const adminNav = [
  { label: 'Dashboard',         icon: LayoutDashboard, to: '/admin-dashboard' },
  { label: 'User Management',   icon: Users,           to: '/admin-users'      },
  { label: 'Inventory Moderation', icon: Package,         to: '/admin-listings'   },
  { label: 'Platform Orders',   icon: ShoppingCart,    to: '/admin-orders'     },
  { label: 'Profile',           icon: User,            to: '/profile'          },
];

// ─── Component ───────────────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({ userType, setUserType, collapsed, setCollapsed, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isFarmer = userType.toLowerCase() === 'farmer';
  const navItems = isFarmer ? farmerNav : adminNav;

  const roleLabel = isFarmer ? 'Farmer' : 'Admin';
  const roleColor = isFarmer ? '#5ba409' : '#7C3AED';
  const roleBg    = isFarmer ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // ─── Sidebar content (shared between desktop & mobile) ────────────────────
  const SidebarContent = (
    <div className="flex flex-col h-full">

      {/* Logo — centered in both states, larger when collapsed */}
      <div
        className="flex items-center justify-center px-4 py-5 border-b border-gray-100"
        style={{ minHeight: '80px' }}
      >
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <img
            src="/src/assets/logo/AgriLinkGREEN.png"
            alt="AgriLink"
            className={`object-contain flex-shrink-0 transition-all duration-300 ${
              collapsed ? 'w-12 h-12' : 'w-10 h-10'
            }`}
          />
          {!collapsed && (
            <span className="text-xl font-black text-[#2E7D32] whitespace-nowrap">
              AgriLink
            </span>
          )}
        </Link>
      </div>

      {/* User info */}
      <div className={`px-4 py-4 border-b border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: roleColor }}
            title={roleLabel}
          >
            {roleLabel[0]}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: roleColor }}
            >
              {isFarmer ? 'JD' : 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-gray-900 text-sm truncate">
                {isFarmer ? 'Juan dela Cruz' : 'Admin User'}
              </p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleBg}`}>
                {roleLabel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {navItems.map(({ label, icon: Icon, to }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150
                ${active
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                ${collapsed ? 'justify-center' : ''}
              `}
              style={active ? { background: roleColor } : {}}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto px-3 py-4 border-t border-gray-100 space-y-2 sticky bottom-0 bg-white z-10">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`
            flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-semibold text-sm
            text-red-600 hover:bg-red-50 transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* ── Mobile overlay + drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 bg-white shadow-2xl flex flex-col animate-slideInLeft">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className={`
          hidden md:flex flex-col bg-white border-r border-gray-200 shadow-sm
          transition-all duration-300 ease-in-out flex-shrink-0 fixed top-0 left-0 h-screen z-40
          ${collapsed ? 'w-20' : 'w-64'}
        `}
      >
        {SidebarContent}

        {/* Floating collapse tab — right edge, vertically centred */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="
            hidden md:flex absolute -right-3 top-6
            w-6 h-10 bg-white border border-gray-200 shadow-md rounded-full
            items-center justify-center text-gray-400 hover:text-[#5ba409]
            hover:border-[#5ba409] transition-colors z-10
          "
        >
          {collapsed
            ? <ChevronRight className="w-3.5 h-3.5" />
            : <ChevronLeft  className="w-3.5 h-3.5" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
