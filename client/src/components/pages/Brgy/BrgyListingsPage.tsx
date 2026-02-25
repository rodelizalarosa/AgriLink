import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronRight,
  TrendingUp,
  Tag,
  ArrowRight,
  Calendar,
  Camera,
  Upload
} from 'lucide-react';
import Modal from '../../ui/Modal';

const BrgyListingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for crops listed by the barangay
  const mySubmissions = [
    { id: 101, name: 'Red Onions', farmer: 'Mang Jose', qty: '100kg', status: 'Pending LGU', date: '2026-02-25', price: '₱45/kg' },
    { id: 102, name: 'Fresh Tomatoes', farmer: 'Maria Santos', qty: '50kg', status: 'Approved', date: '2026-02-24', price: '₱60/kg' },
    { id: 103, name: 'Green Mangoes', farmer: 'Ricardo Ramos', qty: '200kg', status: 'Pending LGU', date: '2026-02-23', price: '₱120/kg' },
    { id: 104, name: 'Eggplant', farmer: 'Elena Garcia', qty: '30kg', status: 'Rejected', date: '2026-02-22', price: '₱40/kg' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#5ba409] font-black text-xs uppercase tracking-widest bg-green-100/50 w-fit px-3 py-1.5 rounded-full border border-green-200">
              <Package className="w-3.5 h-3.5" /> Inventory Management
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Manage Listings</h1>
            <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
              Register local harvests for LGU verification. These crops will only appear on the public marketplace once approved.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-[#5ba409] hover:bg-[#4d8f08] text-white px-8 py-5 rounded-[2.5rem] font-black text-lg transition-all shadow-2xl shadow-green-500/30 hover:-translate-y-2 active:scale-95"
          >
            <Plus className="w-6 h-6" /> Submit New Crop
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Live Listings', val: '18', icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Awaiting LGU', val: '12', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Active Farmers', val: '42', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Rejected', val: '2', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-black text-gray-900">{stat.val}</h4>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Search crops, farmers or status..." 
               className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#5ba409] focus:bg-white transition-all font-bold outline-none"
             />
           </div>
           <div className="flex gap-4 shrink-0">
             <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-gray-100 rounded-2xl font-black text-gray-600 transition-all">
               <Filter className="w-4 h-4" /> Filter by Status
             </button>
           </div>
        </div>

        {/* Submission Table/Grid */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50/50 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">Crop Submission History</h2>
            <div className="flex items-center gap-2 text-xs font-black text-gray-400">
               <Calendar className="w-4 h-4" /> RECENT UPDATES
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {mySubmissions.map((item, idx) => (
              <div key={idx} className="p-8 hover:bg-green-50/10 transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Info Column */}
                  <div className="flex items-center gap-6 lg:w-1/3">
                    <div className={`w-16 h-16 rounded-[1.5rem] shrink-0 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform ${
                      item.status === 'Approved' ? 'bg-[#5ba409] text-white' : 
                      item.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-[#FFC107] text-white'
                    }`}>
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-[#5ba409] transition-colors">{item.name}</h3>
                      <p className="text-sm font-bold text-gray-400">Farmer: <span className="text-gray-700">{item.farmer}</span></p>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="flex flex-wrap gap-10 lg:w-1/3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Quantity</p>
                      <p className="font-black text-gray-700">{item.qty}</p>
                    </div>
                    <div className="space-y-1 text-right lg:text-left">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Market Price</p>
                      <p className="font-black text-gray-700">{item.price}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Submitted On</p>
                      <p className="font-black text-gray-700">{item.date}</p>
                    </div>
                  </div>

                  {/* Status & Actions Column */}
                  <div className="flex flex-1 items-center justify-between lg:justify-end gap-6">
                    <div className="flex flex-col items-end">
                      <div className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${
                        item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                        {item.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {item.status === 'Pending LGU' && <Clock className="w-3 h-3" />}
                        {item.status}
                      </div>
                      {item.status === 'Rejected' && (
                        <p className="text-[10px] font-black text-red-500 mt-2 uppercase underline underline-offset-4 cursor-pointer">View Feedback</p>
                      )}
                    </div>
                    <button className="p-4 bg-gray-50 hover:bg-[#5ba409] hover:text-white rounded-2xl text-gray-400 shadow-sm transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-8 bg-gray-50/50 flex justify-center">
            <button className="flex items-center gap-2 text-sm font-black text-[#5ba409] hover:gap-3 transition-all uppercase tracking-widest">
              View Audit History <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-[#1B5E20] rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
           <div className="shrink-0">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <AlertCircle className="w-10 h-10" />
              </div>
           </div>
           <div className="space-y-2 relative z-10 text-center md:text-left">
             <h3 className="text-2xl font-black italic tracking-tight underline decoration-green-400 underline-offset-8">Listing Guidelines for LGU Approval</h3>
             <p className="text-green-100/80 font-medium">To avoid rejection, ensure all submitted crops have high-quality photos, accurate stock counts, and verified farmer identification. Phenotyping results significantly increase approval speed.</p>
           </div>
           <div className="absolute right-[-40px] top-[-40px] opacity-10">
              <Package className="w-64 h-64" />
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

export default BrgyListingsPage;
