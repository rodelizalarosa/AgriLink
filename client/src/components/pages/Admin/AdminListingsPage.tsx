import React from 'react';
import { Search, Filter, AlertTriangle, CheckCircle2, XCircle, Eye, Tag, Package, History } from 'lucide-react';
import { sampleProducts } from '../../../data';
import type { Product } from '../../../types';

const AdminListingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#5ba409] font-black text-xs uppercase tracking-widest bg-green-100/50 w-fit px-3 py-1.5 rounded-full border border-green-200 mb-3">
            <Package className="w-3.5 h-3.5" /> Marketplace Moderation
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">Inventory Moderation</h1>
          <p className="text-lg text-gray-500 font-medium">Review, approve, and manage marketplace listings for quality assurance.</p>
        </div>

        {/* Categories / Stats Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'All Listings', count: 1234, active: true },
            { label: 'Awaiting Review', count: 12, active: false, highlight: true },
            { label: 'Out of Stock', count: 45, active: false },
            { label: 'Suspended', count: 3, active: false },
          ].map((tab, i) => (
            <button key={i} className={`p-8 rounded-[2rem] text-left transition-all relative overflow-hidden group ${
              tab.active 
                ? 'bg-[#5ba409] text-white shadow-2xl shadow-green-500/40 -translate-y-1' 
                : 'bg-white text-gray-600 hover:bg-green-50/50 border border-gray-100 shadow-xl shadow-gray-200/50'
            }`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${tab.active ? 'text-green-100' : 'text-gray-400'}`}>
                {tab.label}
              </p>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-4xl font-black tracking-tight">{tab.count}</span>
                {tab.highlight && <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse shadow-lg shadow-red-500/50"></div>}
              </div>
              {tab.active && (
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Package className="w-24 h-24" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Listing Grid */}
        <div className="space-y-10">
          <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50/50 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search products by name, farmer, or category..." 
                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#5ba409] focus:bg-white transition-all font-bold outline-none"
              />
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <select className="flex-1 lg:flex-none px-6 py-4 bg-gray-50/50 rounded-2xl font-bold text-gray-600 outline-none hover:bg-white border border-transparent focus:border-[#5ba409] transition-all cursor-pointer">
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
              </select>
              <button className="flex items-center gap-2 px-8 py-4 bg-[#5ba409] text-white rounded-2xl font-black shadow-xl shadow-green-500/20 hover:-translate-y-1 transition-all uppercase tracking-widest text-xs">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {sampleProducts.map((product: Product) => (
              <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-[0_30px_60px_-15px_rgba(27,94,32,0.15)] transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#5ba409]" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8 translate-y-4 group-hover:translate-y-0">
                    <div className="flex gap-3 w-full">
                      <button className="flex-1 bg-white text-gray-900 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#5ba409] hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg">
                        <Eye className="w-4 h-4" /> Quick Preview
                      </button>
                      <button className="p-3.5 bg-white/20 backdrop-blur-md text-white rounded-2xl font-black hover:bg-white/40 transition-all shadow-lg border border-white/20">
                        <History className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1 leading-tight group-hover:text-[#5ba409] transition-colors">{product.name}</h3>
                      <p className="text-sm font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
                        Sold by <span className="text-[#5ba409] underline decoration-green-200 underline-offset-4 cursor-pointer">{product.seller}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#5ba409]">₱{product.price}</p>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">per {product.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 py-6 border-y border-gray-50 mb-8">
                      <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-300 uppercase mb-2 tracking-widest">Market Stock</p>
                          <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                                <Package className="w-4 h-4 text-[#5ba409]" />
                              </div>
                              <span className="font-black text-gray-700">{product.stock} <span className="text-gray-400 font-bold uppercase text-[10px] ml-1">{product.unit}s</span></span>
                          </div>
                      </div>
                      <div className="flex-1 text-right">
                          <p className="text-[10px] font-black text-gray-300 uppercase mb-2 tracking-widest">Trust Score</p>
                          <span className="text-[10px] font-black px-4 py-1.5 bg-green-100/50 text-green-700 rounded-full uppercase tracking-tighter border border-green-100">Verified Seller</span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20 group/btn">
                      <AlertTriangle className="w-4 h-4 transition-transform group-hover/btn:scale-125" /> Suspend
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm border border-transparent hover:border-gray-900">
                      <XCircle className="w-4 h-4" /> De-list
                    </button>
                    <button title="Fast Approve" className="col-span-2 py-4 bg-[#5ba409] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4d8f08] transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Express Approval
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-8 border-4 border-dashed border-gray-100 rounded-[2.5rem] font-black text-gray-300 hover:border-[#5ba409] hover:text-[#5ba409] transition-all bg-white/50 hover:bg-white shadow-2xl shadow-gray-100/50 uppercase tracking-[0.2em] text-sm">
             Browse Extended Marketplace Catalog
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminListingsPage;
