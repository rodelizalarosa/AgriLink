import { ShoppingCart, Menu, X, LogOut, User as UserIcon, MessageSquare, Bell, CheckCheck, ShoppingBag, Package, Tractor, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { NavbarProps } from '../../types';
import { useState, useRef, useEffect } from 'react';
import { buyerNotifications, farmerNotifications, sampleConversations } from '../../data';

const Navbar: React.FC<NavbarProps> = ({ userType, setUserType, isLoggedIn, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isFarmer = userType.toLowerCase() === 'farmer';
  const roleNotifications = isFarmer ? farmerNotifications : buyerNotifications;
  const previewNotifications = roleNotifications.slice(0, 4);
  const unreadNotifCount = roleNotifications.filter(n => n.status === 'unread').length;

  const previewConversations = sampleConversations.slice(0, 4);
  const unreadMsgCount = sampleConversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (msgRef.current && !msgRef.current.contains(e.target as Node)) setMsgOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type: string, isFarmerRole: boolean) => {
    if (type === 'message') return MessageSquare;
    if (type === 'order' && isFarmerRole) return Tractor;
    if (type === 'order') return ShoppingBag;
    return Package;
  };

  const getNotifColor = (type: string, isFarmerRole: boolean) => {
    if (type === 'message') return 'bg-green-100 text-green-600';
    if (type === 'order' && isFarmerRole) return 'bg-amber-100 text-amber-600';
    if (type === 'order') return 'bg-blue-100 text-blue-600';
    return 'bg-purple-100 text-purple-600';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/src/assets/logo/AgriLinkGREEN.png" alt="AgriLink Logo" className="w-16 h-16 object-contain transform hover:scale-105 transition-all" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className="text-gray-700 hover:text-green-600 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]">Marketplace</Link>
            <Link to="/map" className="text-gray-700 hover:text-[#5ba409] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]">Maps</Link>
            <Link to="/about" className="text-gray-700 hover:text-[#5ba409] font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#F9FBE7]">About</Link>

            <div className="flex items-center space-x-3">
              <Link to="/cart" className="relative p-2 hover:bg-[#F9FBE7] rounded-full transition-colors block">
                <ShoppingCart className="w-6 h-6 text-[#5ba409]" />
                <span className="absolute -top-1 -right-1 bg-[#FFC107] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </Link>

              {isLoggedIn && (
                <>
                  {/* 💬 Messages Dropdown */}
                  <div className="relative" ref={msgRef}>
                    <button
                      onClick={() => { setMsgOpen(!msgOpen); setNotifOpen(false); }}
                      className="relative p-2 hover:bg-[#F9FBE7] rounded-full transition-colors block"
                    >
                      <MessageSquare className={`w-6 h-6 text-[#5ba409] transition-transform duration-300 ${msgOpen ? '-rotate-6' : ''}`} />
                      {unreadMsgCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                          {unreadMsgCount}
                        </span>
                      )}
                    </button>

                    {/* Messages Dropdown Panel */}
                    {msgOpen && (
                      <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-3xl shadow-2xl shadow-gray-300/40 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
                        {/* Header */}
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                          <div>
                            <h3 className="text-base font-black text-gray-900">Messages</h3>
                            <p className="text-[10px] font-bold text-gray-400">{unreadMsgCount} unread conversation{unreadMsgCount !== 1 ? 's' : ''}</p>
                          </div>
                          <button className="text-[10px] font-black text-green-600 flex items-center gap-1 hover:underline">
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        </div>

                        {/* Conversation List */}
                        <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                          {previewConversations.map(conv => (
                            <button
                              key={conv.id}
                              className={`w-full text-left p-4 hover:bg-gray-50/80 transition-all flex items-center gap-4 ${conv.unreadCount > 0 ? 'bg-green-50/20' : ''}`}
                              onClick={() => { setMsgOpen(false); navigate('/messages'); }}
                            >
                              {/* Avatar */}
                              <div className={`relative shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${conv.unreadCount > 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {conv.participantImage}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <p className={`text-sm font-black tracking-tight ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {conv.participantName}
                                  </p>
                                  <span className="text-[9px] font-black text-gray-400 uppercase shrink-0">{conv.lastMessageTime}</span>
                                </div>
                                <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-700 font-bold' : 'text-gray-400 font-medium'}`}>
                                  {conv.lastMessage}
                                </p>
                              </div>

                              {conv.unreadCount > 0 && (
                                <div className="w-5 h-5 bg-green-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0 shadow-md shadow-green-500/30">
                                  {conv.unreadCount}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Quick Reply Input */}
                        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                          <button
                            onClick={() => { setMsgOpen(false); navigate('/messages'); }}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" /> Open Messenger
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 🔔 Notification Bell Dropdown */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => { setNotifOpen(!notifOpen); setMsgOpen(false); }}
                      className="relative p-2 hover:bg-[#F9FBE7] rounded-full transition-colors block"
                    >
                      <Bell className={`w-6 h-6 text-[#5ba409] transition-transform duration-300 ${notifOpen ? 'rotate-12' : ''}`} />
                      {unreadNotifCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                          {unreadNotifCount}
                        </span>
                      )}
                    </button>

                    {notifOpen && (
                      <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-3xl shadow-2xl shadow-gray-300/40 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-gray-900">Notifications</h3>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${isFarmer ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {isFarmer ? 'Farmer' : 'Buyer'}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400">{unreadNotifCount} unread alert{unreadNotifCount !== 1 ? 's' : ''}</p>
                          </div>
                          <button className="text-[10px] font-black text-green-600 flex items-center gap-1 hover:underline">
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        </div>

                        <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                          {previewNotifications.map(notif => {
                            const IconComp = getNotifIcon(notif.type, isFarmer);
                            const colorClass = getNotifColor(notif.type, isFarmer);
                            return (
                              <button
                                key={notif.id}
                                className={`w-full text-left p-5 hover:bg-gray-50/80 transition-all flex items-start gap-4 ${notif.status === 'unread' ? 'bg-green-50/20' : ''}`}
                                onClick={() => { setNotifOpen(false); notif.link && navigate(notif.link); }}
                              >
                                <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${colorClass}`}>
                                  <IconComp className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className={`text-sm font-black tracking-tight ${notif.status === 'unread' ? 'text-gray-900' : 'text-gray-500'}`}>{notif.title}</p>
                                    <span className="text-[9px] font-black text-gray-400 uppercase shrink-0">{notif.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 font-medium leading-snug line-clamp-2">{notif.message}</p>
                                </div>
                                {notif.status === 'unread' && <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-2" />}
                              </button>
                            );
                          })}
                        </div>

                        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                          <button
                            onClick={() => { setNotifOpen(false); navigate('/notifications'); }}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
                          >
                            View All {isFarmer ? 'Farmer' : 'Buyer'} Notifications
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!isLoggedIn ? (
                <>
                  <button onClick={() => navigate('/login')} className="bg-[#5ba409] border-2 border-[#5ba409] text-white hover:bg-white hover:text-[#5ba409] px-4 py-2 rounded-full font-semibold transition-colors">Login</button>
                  <button onClick={() => navigate('/register')} className="border-2 border-[#5ba409] text-[#5ba409] hover:bg-[#5ba409] hover:text-white px-4 py-2 rounded-full font-semibold transition-colors">Register</button>
                </>
              ) : (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l-2 border-gray-100">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-[#5ba409] transition-colors">
                    <div className="bg-green-100 p-2 rounded-full">
                      <UserIcon className="w-5 h-5 text-[#4CAF50]" />
                    </div>
                    <span className="font-bold capitalize">{userType}</span>
                  </Link>
                  <button onClick={() => { onLogout(); navigate('/'); }} className="flex items-center space-x-1 text-red-500 hover:text-red-600 font-bold transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-[#F9FBE7]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fadeIn">
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold block">Marketplace</Link>
            <Link to="/map" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold block">Maps</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold block">About</Link>

            {isLoggedIn && (
              <>
                <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-green-600" /> Messages</span>
                  {unreadMsgCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{unreadMsgCount}</span>}
                </Link>
                <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#F9FBE7] font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-green-600" />
                    {isFarmer ? 'Farmer Alerts' : 'My Notifications'}
                  </span>
                  {unreadNotifCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{unreadNotifCount}</span>}
                </Link>
              </>
            )}
            {!isLoggedIn ? (
              <>
                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full bg-[#4CAF50] border-2 border-[#4CAF50] hover:bg-[#45A049] text-white px-4 py-3 rounded-lg font-semibold">Login</button>
                <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="w-full border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white px-4 py-3 rounded-lg font-semibold">Register</button>
              </>
            ) : (
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); navigate('/'); }} className="w-full bg-red-50 text-red-500 border-2 border-red-500 py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
                <LogOut className="w-5 h-5" /><span>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
