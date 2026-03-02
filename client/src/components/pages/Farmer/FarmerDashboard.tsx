import React, { useState } from 'react';
import { Plus, Package, ShoppingCart, TrendingUp, Users, AlertTriangle, MessageSquare, Bell, X, ChevronRight, Clock, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FarmerDashboardProps } from '../../../types';
import { sampleProducts, farmerOrders, farmerNotifications, sampleConversations } from '../../../data';
import DashboardCard from '../../ui/DashboardCard';

const FarmerDashboard: React.FC<FarmerDashboardProps> = () => {
  const navigate = useNavigate();
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const pendingOrders = farmerOrders.filter(o => o.status === 'Pending');
  const unreadMessages = sampleConversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotifs = farmerNotifications.filter(n => n.status === 'unread');
  const unreadOrderNotifs = unreadNotifs.filter(n => n.type === 'order');

  const hasUrgentItems = (pendingOrders.length > 0 || unreadMessages > 0) && !dismissedBanner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Farmer Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back, Juan dela Cruz! 👨‍🌾</p>
          </div>
          <button
            onClick={() => navigate('/product-upload')}
            className="bg-[#5ba409] hover:bg-[#4d8f08] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard icon={Package} title="Active Listings" value="12" subtitle="4 low on stock" color="#5ba409" />
          <DashboardCard icon={ShoppingCart} title="Orders Today" value="8" subtitle={`${pendingOrders.length} pending`} color="#FFC107" trend="+15% from yesterday" />
          <DashboardCard icon={TrendingUp} title="Total Sales" value="₱24,500" subtitle="This month" color="#2196F3" trend="+23% from last month" />
          <DashboardCard icon={Users} title="Customers" value="156" subtitle="45 returning" color="#8D6E63" />
        </div>

        {/* 🔔 Notifications Preview */}
        {unreadNotifs.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-8 overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-50/60 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-none">Recent Alerts</h2>
                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">{unreadNotifs.length} require attention</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/notifications')}
                  className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {unreadNotifs.slice(0, 3).map(notif => (
                  <button
                    key={notif.id}
                    onClick={() => notif.link && navigate(notif.link)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] ${
                      notif.type === 'order'
                        ? 'bg-red-50 border-red-100 hover:border-red-300'
                        : 'bg-blue-50 border-blue-100 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'order' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {notif.type === 'order'
                        ? <ShoppingCart className="w-5 h-5" />
                        : <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`font-black text-sm ${notif.type === 'order' ? 'text-red-800' : 'text-blue-800'}`}>{notif.title}</p>
                        <span className={`text-[8px] font-black text-white px-1.5 py-0.5 rounded-full uppercase animate-pulse ${notif.type === 'order' ? 'bg-red-500' : 'bg-blue-500'}`}>
                          {notif.type === 'order' ? 'NEW' : 'UNREAD'}
                        </span>
                      </div>
                      <p className={`text-xs font-medium truncate ${notif.type === 'order' ? 'text-red-600' : 'text-blue-600'}`}>{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-black text-gray-400 uppercase">{notif.timestamp}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Listings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Product</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Price</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Stock</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleProducts.slice(0, 4).map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-[#F9FBE7] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {product.image.startsWith('http') || product.image.includes('.') ? (
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        ) : (
                          <span className="text-3xl">{product.image}</span>
                        )}
                        <span className="font-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#5ba409]">₱{product.price}/{product.unit}</td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${product.stock < 20 ? 'text-red-600' : 'text-gray-700'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">Active</span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-[#5ba409] hover:text-[#4d8f08] font-semibold mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-700 font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {farmerOrders.map((order) => (
              <div
                key={order.id}
                className={`flex flex-col md:flex-row md:items-center justify-between p-4 border-2 rounded-xl transition-all ${
                  order.status === 'Pending'
                    ? 'border-red-300 bg-red-50 hover:border-red-500'
                    : 'border-gray-100 hover:border-[#5ba409]'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                      order.status === 'Pending' ? 'bg-red-500 text-white animate-pulse' :
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'Pending' ? '⚡ ' : ''}{order.status}
                    </span>
                    {order.status === 'Pending' && (
                      <span className="text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Confirm ASAP
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600"><span className="font-semibold">Buyer:</span> {order.buyer}</p>
                  <p className="text-gray-600"><span className="font-semibold">Product:</span> {order.product} × {order.qty}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <span className="text-2xl font-bold text-[#5ba409]">{order.amount}</span>
                  <button className={`text-white px-4 py-2 rounded-lg font-semibold transition-all ${
                    order.status === 'Pending'
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                      : 'bg-[#5ba409] hover:bg-[#4d8f08]'
                  }`}>
                    {order.status === 'Pending' ? 'Confirm Now' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FarmerDashboard;
