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
  XCircle
} from 'lucide-react';
import DashboardCard from '../../ui/DashboardCard';
import Modal from '../../ui/Modal';
import { Link } from 'react-router-dom';

const BrgyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Barangay Administration</h1>
            <p className="text-lg text-gray-600 font-medium">Register local harvests for LGU verification and marketplace listing</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#5ba409] hover:bg-[#4d8f08] text-white px-6 py-4 rounded-[2rem] font-bold transition-all shadow-xl shadow-green-500/20 hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" /> Submit New Crop
          </button>
        </div>

        {/* Status Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            icon={Package}
            title="Total Submissions"
            value="32"
            subtitle="Crops listed by your office"
            color="#5ba409"
            trend="+5 this week"
          />
          <DashboardCard
            icon={ClipboardList}
            title="Pending LGU"
            value="12"
            subtitle="Awaiting authorization"
            color="#FFC107"
            trend="Needs LGU action"
          />
          <DashboardCard
            icon={CheckCircle}
            title="LGU Approved"
            value="18"
            subtitle="Live in marketplace"
            color="#2E7D32"
            trend="Active listings"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area: My Submissions */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-green-900/5 p-8 border border-green-50/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Recent Crop Submissions</h2>
                  <p className="text-gray-500 text-sm">Monitor the LGU approval status of your listed crops</p>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                  {['All', 'Pending', 'Approved'].map(t => (
                    <button key={t} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${t === 'All' ? 'bg-white shadow-sm text-[#5ba409]' : 'text-gray-500'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Red Onions', farmer: 'Mang Jose', qty: '100kg', status: 'Pending LGU', date: 'Submitted Today' },
                  { name: 'Fresh Tomatoes', farmer: 'Maria Santos', qty: '50kg', status: 'Approved', date: 'Approved 2h ago' },
                  { name: 'Green Mangoes', farmer: 'Ricardo Ramos', qty: '200kg', status: 'Pending LGU', date: 'Submitted Yesterday' },
                  { name: 'Eggplant', farmer: 'Elena Garcia', qty: '30kg', status: 'Rejected', date: 'Action Required' }
                ].map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between p-6 border-2 border-gray-50 rounded-3xl hover:border-[#5ba409]/30 hover:bg-green-50/10 transition-all">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                        item.status === 'Approved' ? 'bg-[#5ba409]' : item.status === 'Rejected' ? 'bg-red-500' : 'bg-[#FFC107]'
                      }`}>
                        <Package className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#5ba409] transition-colors">{item.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{item.qty} • Farmer: {item.farmer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-1 ${
                        item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </div>
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
                <Users className="w-5 h-5 text-[#5ba409]" />
                Farmer Outreach
              </h3>
              <div className="space-y-6">
                {[
                  { name: 'Maria Santos', activity: 'Add Listing', time: '10m ago' },
                  { name: 'Ricardo Ramos', activity: 'Price Update', time: '1h ago' },
                  { name: 'Elena Garcia', activity: 'Collection', time: '3h ago' },
                ].map((farmer, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-green-100 flex items-center justify-center text-xs font-black text-gray-400 group-hover:text-[#5ba409] transition-all">
                        {farmer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 tracking-tight">{farmer.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{farmer.activity}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-[#5ba409] hover:underline uppercase tracking-tighter">Contact</button>
                  </div>
                ))}
              </div>
              <Link 
                to="/admin-users"
                className="w-full mt-10 py-4 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-900 hover:text-white transition-all uppercase tracking-widest block text-center"
              >
                View All Farmers
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-orange-50/50 rounded-[2rem] p-8 border border-orange-100/50">
               <h3 className="text-lg font-bold text-orange-900 mb-4 tracking-tighter">LGU Validation Tips</h3>
               <ul className="space-y-3">
                 {[
                   'Ensure crop weights are accurate',
                   'Upload clear photos for analysis',
                   'Verify farmer registration first',
                   'Correct rejected listings promptly'
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 text-xs text-orange-800 font-medium">
                     <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                     {tip}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>

        {/* Submit Crop Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Submit Local Harvest"
        >
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); alert('Crop submitted for LGU approval! 🌾'); }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Crop Name</label>
                <input type="text" className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="e.g. Red Onions" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity</label>
                  <input type="text" className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="100kg" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price per Unit</label>
                  <input type="text" className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="₱45/kg" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Farmer Association</label>
                <select className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700">
                  <option>Select Farmer</option>
                  <option>Mang Jose</option>
                  <option>Maria Santos</option>
                </select>
              </div>

              <div className="p-8 border-4 border-dashed border-gray-100 rounded-[2rem] text-center hover:border-[#5ba409] transition-all cursor-pointer bg-gray-50/30 group">
                <div className="flex flex-col items-center gap-2">
                  <Camera className="w-10 h-10 text-gray-300 group-hover:text-[#5ba409] transition-colors" />
                  <p className="text-sm font-black text-gray-400 group-hover:text-gray-900">Upload Crop Images</p>
                  <p className="text-[10px] text-gray-300 uppercase tracking-tighter">Required for LGU Validation</p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-[#5ba409] text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-green-500/30 hover:-translate-y-1 transition-all">
              Submit to LGU
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default BrgyDashboard;
