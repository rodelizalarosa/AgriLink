import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  ShoppingCart, 
  TrendingUp, 
  Camera, 
  ClipboardList, 
  CheckCircle, 
  Truck,
  Users,
  Search,
  Clock,
  XCircle,
  ShieldCheck,
  Leaf,
  Star
} from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import { Link, useNavigate } from 'react-router-dom';

const BrgyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Barangay Administration</h1>
            <p className="text-lg text-gray-600 font-medium">Verify local farmers and award badges for buyer trust</p>
          </div>
        </div>

        {/* Status Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            icon={Package}
            title="Total Listed Crops"
            value="32"
            subtitle="Live in marketplace"
            color="#5ba409"
            trend="+5 this week"
          />
          <DashboardCard
            icon={ShieldCheck}
            title="Badges Awarded"
            value="45"
            subtitle="Trust indicators issued"
            color="#1976D2"
            trend="Active verification"
          />
          <DashboardCard
            icon={Users}
            title="Verified Farmers"
            value="18"
            subtitle="Trusted local producers"
            color="#2E7D32"
            trend="Growing community"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area: My Submissions */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-green-900/5 p-8 border border-green-50/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Community Trust Management</h2>
                  <p className="text-gray-500 text-sm">Monitor listings and certify reliable local harvests</p>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  {['All', 'Standard', 'Badged'].map(t => (
                    <button key={t} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${t === 'All' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Red Onions', farmer: 'Mang Jose', qty: '100kg', status: 'Listed', date: 'Submitted Today', badges: [] },
                  { name: 'Fresh Tomatoes', farmer: 'Maria Santos', qty: '50kg', status: 'Trust Badge', date: 'Certified 2h ago', badges: ['Brgy. Verified'] },
                  { name: 'Green Mangoes', farmer: 'Ricardo Ramos', qty: '200kg', status: 'Listed', date: 'Submitted Yesterday', badges: [] },
                  { name: 'Eggplant', farmer: 'Elena Garcia', qty: '30kg', status: 'Top Seller', date: 'Awarded Recently', badges: ['Top Seller'] }
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-6 border-2 border-gray-50 rounded-3xl hover:border-green-600/30 hover:bg-green-50/10 transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                        item.badges.length > 0 ? 'bg-green-600' : 'bg-gray-400'
                      }`}>
                        <Package className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors">{item.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{item.qty} • Farmer: {item.farmer}</p>
                        <div className="flex gap-2 mt-1">
                          {item.badges.map((b, i) => (
                             <span key={i} className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter ${b.toLowerCase().includes('verified') ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>{b}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <button 
                        onClick={() => navigate('/brgy-award-badge')}
                        className="text-[10px] font-black bg-white hover:bg-green-600 hover:text-white text-green-600 px-4 py-2 border border-green-600 rounded-xl transition-all shadow-sm"
                       >
                          Award New Badge
                       </button>
                       <p className="text-[10px] text-gray-400 font-bold">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Farmer Verification
              </h3>
              <div className="space-y-6">
                {[
                  { name: 'Maria Santos', activity: 'New Listing', time: '10m ago' },
                  { name: 'Ricardo Ramos', activity: 'Inspection', time: '1h ago' },
                  { name: 'Elena Garcia', activity: 'Badge Review', time: '3h ago' },
                ].map((farmer, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center text-xs font-black text-gray-400 group-hover:text-blue-600 transition-all">
                        {farmer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 tracking-tight">{farmer.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{farmer.activity}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-tighter">Certify</button>
                  </div>
                ))}
              </div>
              <Link 
                to="/admin-users"
                className="w-full mt-10 py-4 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest block text-center"
              >
                View All Community Farmers
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-[#1976D2]/5 rounded-[2rem] p-8 border border-blue-100/50">
               <h3 className="text-lg font-bold text-blue-900 mb-4 tracking-tighter">Trust Badges Tips</h3>
               <ul className="space-y-3">
                 {[
                   'Certify organic practices',
                   'Verify accurate harvest weight',
                   'Recognize reliable delivery history',
                   'Promote high-quality produce variants'
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-xs text-blue-800 font-medium">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                     {tip}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrgyDashboard;
