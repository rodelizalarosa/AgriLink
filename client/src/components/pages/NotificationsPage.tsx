import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  ShoppingCart,
  Settings,
  Trash2,
  Package,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { buyerNotifications, farmerNotifications } from '../../data';
import type { Notification } from '../../types';
import { useNavigate } from 'react-router-dom';

interface NotificationsPageProps {
  userType?: string;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ userType = 'buyer' }) => {
  const navigate = useNavigate();
  const isFarmer = userType.toLowerCase() === 'farmer';
  const roleNotifications = isFarmer ? farmerNotifications : buyerNotifications;
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(roleNotifications);

  const displayNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.status === 'unread');

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':   return isFarmer ? <TrendingUp className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />;
      case 'message': return <MessageSquare className="w-5 h-5" />;
      case 'system':  return <Settings className="w-5 h-5" />;
      default:        return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order':   return 'bg-amber-100 text-amber-600 shadow-amber-500/10';
      case 'message': return 'bg-blue-100 text-blue-600 shadow-blue-500/10';
      case 'system':  return 'bg-purple-100 text-purple-600 shadow-purple-500/10';
      default:        return 'bg-green-100 text-green-600 shadow-green-500/10';
    }
  };

  // Subtle label for farmer unread items — no pulsing, no ALL-CAPS RED
  const getFarmerLabel = (type: string) => {
    if (!isFarmer) return null;
    if (type === 'order')   return { label: 'New Order', color: 'bg-amber-100 text-amber-700' };
    if (type === 'message') return { label: 'New Message', color: 'bg-blue-100 text-blue-700' };
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-green-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-3">
            <Bell className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none mb-2">
              {isFarmer ? 'Notifications' : 'Activities'}
            </h1>
            <p className="text-lg font-bold text-gray-400 italic">
              {isFarmer
                ? `${unreadCount > 0 ? `${unreadCount} item${unreadCount !== 1 ? 's' : ''} need your attention` : 'All caught up'}`
                : 'Stay updated with your latest alerts'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center gap-2"
            onClick={() => setNotifications([])}
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
          <button className="px-6 py-3 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-900/10">
            Settings
          </button>
        </div>
      </div>

      {/* Notification Card */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-green-50 to-transparent -z-10" />

        {/* Tabs */}
        <div className="p-10 border-b border-gray-100 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'all' ? 'bg-green-600 text-white shadow-xl shadow-green-500/30' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
                activeTab === 'unread' ? 'bg-green-600 text-white shadow-xl shadow-green-500/30' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px]">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })))}
            className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline underline-offset-4 decoration-2"
          >
            Mark all as read
          </button>
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-50">
          {displayNotifications.length > 0 ? (
            displayNotifications.map(notif => {
              const isUnread = notif.status === 'unread';
              const farmerLabel = isUnread ? getFarmerLabel(notif.type) : null;
              return (
                <div
                  key={notif.id}
                  className={`p-10 hover:bg-gray-50/80 transition-all group flex items-start gap-8 cursor-pointer relative ${
                    isUnread ? 'bg-green-50/20' : ''
                  }`}
                  onClick={() => notif.link && navigate(notif.link)}
                >
                  {/* Subtle left border for farmer unread */}
                  {isFarmer && isUnread && (
                    <div className={`absolute left-0 top-6 bottom-6 w-0.5 rounded-full ${
                      notif.type === 'order' ? 'bg-amber-400' :
                      notif.type === 'message' ? 'bg-blue-400' : 'bg-green-400'
                    }`} />
                  )}

                  <div className={`shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${getColor(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className={`text-xl font-black tracking-tight ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notif.title}
                        </h3>
                        {farmerLabel && (
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${farmerLabel.color}`}>
                            {farmerLabel.label}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic shrink-0 ml-4">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed max-w-2xl ${isUnread ? 'text-gray-700 font-bold' : 'text-gray-400 font-medium'}`}>
                      {notif.message}
                    </p>
                    <div className="pt-1">
                      <button className="text-[10px] font-black text-green-600 flex items-center gap-2 group/btn uppercase tracking-widest">
                        View Details <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {isUnread && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-32 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto mb-8 border-2 border-dashed border-gray-100">
                <Bell className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">All caught up!</h3>
              <p className="text-gray-400 font-bold italic">Check back later for updates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Tips */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-[#1B5E20] p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
          <Package className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
          <div className="relative z-10">
            <h4 className="text-lg font-black mb-1 leading-none">{isFarmer ? 'Pending Orders' : 'Order Tracking'}</h4>
            <p className="text-xs text-green-100/60 font-medium mb-6">{isFarmer ? 'Review and confirm new orders from buyers.' : 'Real-time updates for all in-transit harvests.'}</p>
            <button className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-2">{isFarmer ? 'View Orders' : 'Track Activity'}</button>
          </div>
        </div>
        <div className="bg-[#5ba409] p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
          <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
          <div className="relative z-10">
            <h4 className="text-lg font-black mb-1 leading-none">Trust Center</h4>
            <p className="text-xs text-green-100/60 font-medium mb-6">{isFarmer ? 'View badges and certifications on your profile.' : 'Check certifications of your favourite farmers.'}</p>
            <button className="text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-2">View Profile</button>
          </div>
        </div>
        <div className="bg-white border-2 border-gray-50 p-8 rounded-[2.5rem] text-gray-900 overflow-hidden relative group">
          <div className="relative z-10">
            <h4 className="text-lg font-black mb-1 leading-none">Need Help?</h4>
            <p className="text-xs text-gray-400 font-medium mb-6">Our community support team is available 24/7.</p>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#5ba409] border-b-2 border-[#5ba409]/20">Customer Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
