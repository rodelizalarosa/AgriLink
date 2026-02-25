import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Eye, 
  Search,
  Filter,
  BarChart3,
  FileText,
  Clock,
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';

const LGUDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#5ba409] font-black text-xs mb-3 uppercase tracking-widest bg-green-100/50 w-fit px-3 py-1.5 rounded-full border border-green-200">
            <LayoutDashboard className="w-4 h-4" />
            LGU Authorized Representative
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">LGU Administration</h1>
          <p className="text-lg text-gray-500 font-medium">Verify listings and manage platform-wide inquiries</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <DashboardCard
            icon={Package}
            title="Pending Validation"
            value="24"
            subtitle="Crops awaiting approval"
            color="#5ba409"
            trend="Awaiting review"
          />
          <DashboardCard
            icon={ShoppingCart}
            title="Reserved Crops"
            value="128"
            subtitle="Buyer reservations"
            color="#4CAF50"
            trend="Coordination active"
          />
          <DashboardCard
            icon={Users}
            title="System Users"
            value="67"
            subtitle="Verified participants"
            color="#1976D2"
            trend="Platform wide"
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main List Area: Validation Queue */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50/50 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Crop Validation Queue</h2>
                  <p className="text-gray-500 text-sm font-medium italic">Pending crops awaiting marketplace listing</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="relative hidden md:block">
                     <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input type="text" placeholder="Search listing..." className="pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-48 font-bold" />
                   </div>
                   <button className="p-2.5 bg-gray-50 hover:bg-white border border-gray-100 rounded-xl transition-all shadow-sm">
                     <Filter className="w-4 h-4 text-gray-600" />
                   </button>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {[
                  { id: 'CRP-902', name: 'Fresh Red Tomatoes', brgy: 'San Jose', farmer: 'Benito Ramos', volume: '50kg', date: '2h ago' },
                  { id: 'CRP-899', name: 'Organic Eggplant', brgy: 'Sto. Tomas', farmer: 'Clarissa Dee', volume: '30kg', date: '5h ago' },
                  { id: 'CRP-895', name: 'Sweet Calamansi', brgy: 'Sta. Maria', farmer: 'Daniel Sy', volume: '100kg', date: 'Yesterday' },
                ].map((crop, idx) => (
                  <div key={idx} className="p-8 hover:bg-green-50/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-[#5ba409] group-hover:bg-[#5ba409] group-hover:text-white transition-all shadow-lg shadow-gray-100">
                        <Package className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-[#5ba409] transition-colors">{crop.name}</h3>
                          <span className="text-[10px] font-black text-green-600 bg-green-100/50 px-2 py-0.5 rounded-full uppercase tracking-tighter">New Listing</span>
                        </div>
                        <div className="text-sm font-bold text-gray-400 space-x-3">
                          <span>Brgy: <span className="text-gray-700">{crop.brgy}</span></span>
                          <span className="text-gray-200">•</span>
                          <span>Farmer: <span className="text-gray-700">{crop.farmer}</span></span>
                          <span className="text-gray-200">•</span>
                          <span>Volume: <span className="text-gray-700">{crop.volume}</span></span>
                        </div>
                        <p className="text-[10px] text-gray-300 mt-2 uppercase font-black tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Uploaded {crop.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 bg-[#5ba409] hover:bg-[#4d8f08] text-white px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-xl shadow-green-500/20 hover:-translate-y-1 active:scale-95">
                        <CheckCircle className="w-4 h-4" /> Validate
                      </button>
                      <button className="p-3 bg-white hover:bg-red-50 text-red-500 border border-gray-100 rounded-2xl transition-all shadow-sm hover:border-red-100">
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button className="p-3 bg-white hover:bg-gray-50 text-gray-400 rounded-2xl border border-gray-100 transition-all shadow-sm hover:text-gray-900">
                         <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-gray-50/50 text-center border-t border-gray-50">
                <button className="text-sm font-black text-[#5ba409] hover:underline uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                  View Full Queue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50/50 p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                    <Clock className="w-7 h-7 text-[#5ba409]" />
                    Upcoming Verifications
                  </h2>
                  <p className="text-gray-500 text-sm font-medium">Scheduled barangay visits and farmer audits</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { type: 'Field Visit', subject: 'San Jose - Organic Audit', date: 'March 12, 2026', time: '09:00 AM' },
                  { type: 'Coordination', subject: 'Brgy. Meeting - Sto. Tomas', date: 'March 15, 2026', time: '02:00 PM' },
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl border-2 border-gray-50 bg-gray-50/20 transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border bg-white text-gray-400 border-gray-100">{item.type}</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">{item.subject}</h4>
                    <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">{item.date} • {item.time}</p>
                    <button className="w-full py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Logs & Quick Actions */}
          <div className="lg:col-span-4 space-y-10">
            {/* LGU Logs */}
            <div className="bg-[#1B5E20] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black mb-8 flex items-center gap-2 relative z-10">
                <FileText className="w-5 h-5 text-green-300" />
                Live Activity Log
              </h3>
              <div className="space-y-8 relative z-10">
                {[
                  { admin: 'LGU_Juan', action: 'validated San Jose listings', time: '10m ago' },
                  { admin: 'LGU_Officer_9', action: 'resolved inquiry #445', time: '1h ago' },
                  { admin: 'System_LGU', action: 'payout batch authorized', time: '3h ago' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 group-first:animate-ping shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                      <div className="w-[1px] h-full bg-white/10 mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{log.admin}</p>
                      <p className="text-xs font-medium text-green-100/60 leading-relaxed">{log.action}</p>
                      <p className="text-[10px] text-green-400/80 font-black mt-2 uppercase tracking-widest">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-4 bg-white/10 hover:bg-white text-white hover:text-[#1B5E20] rounded-[1.25rem] text-xs font-black transition-all border border-white/10 relative z-10 uppercase tracking-widest">
                Full Audit Trail
              </button>
              <div className="absolute right-[-40px] bottom-[-40px] opacity-10 rotate-12">
                 <FileText className="w-64 h-64" />
              </div>
            </div>

            {/* Performance KPIs - Removed */}
            {/* Coordination Hub - Removed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LGUDashboard;
