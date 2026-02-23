import React from 'react';
import { Search, Filter, AlertTriangle, CheckCircle2, XCircle, Eye, Tag, Package, History } from 'lucide-react';
import { sampleProducts } from '../../../data';
import type { Product } from '../../../types';

const AdminListingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Inventory Moderation</h1>
          <p className="text-lg text-gray-600">Review, approve, and manage marketplace listings</p>
        </div>

        {/* Categories / Stats Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'All Listings', count: 1234, active: true },
            { label: 'Awaiting Review', count: 12, active: false, highlight: true },
            { label: 'Out of Stock', count: 45, active: false },
            { label: 'Suspended', count: 3, active: false },
          ].map((tab, i) => (
            <button key={i} className={`p-6 rounded-3xl text-left transition-all ${
              tab.active 
                ? 'bg-[#5ba409] text-white shadow-xl shadow-green-500/30' 
                : 'bg-white text-gray-600 hover:bg-green-50/50 border border-gray-100 shadow-lg shadow-gray-200/50'
            }`}>
              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${tab.active ? 'text-green-100' : 'text-gray-400'}`}>
                {tab.label}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{tab.count}</span>
                {tab.highlight && <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>}
              </div>
            </button>
          ))}
        </div>

        {/* Listing Grid */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-3xl shadow-lg shadow-green-900/5 border border-green-50 flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search products by name, farmer, or category..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-medium"
              />
            </div>
            <div className="flex gap-4">
              <select className="px-6 py-3 bg-gray-100 rounded-2xl font-bold text-gray-600 outline-none hover:bg-gray-200 transition-all cursor-pointer">
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#5ba409] text-white rounded-2xl font-black shadow-lg shadow-green-500/20 hover:-translate-y-0.5 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sampleProducts.map((product: Product) => (
              <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-lg">
                    <span className="text-xs font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Tag className="w-3 h-3 text-[#5ba409]" /> {product.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex gap-2 w-full">
                      <button className="flex-1 bg-white text-gray-900 py-2.5 rounded-xl font-black text-xs uppercase tracking-tighter hover:bg-[#5ba409] hover:text-white transition-all flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" /> Preview
                      </button>
                      <button className="flex-1 bg-white/20 backdrop-blur text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-tighter hover:bg-white/40 transition-all flex items-center justify-center gap-2">
                        <History className="w-4 h-4" /> Logs
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight group-hover:text-[#5ba409] transition-colors">{product.name}</h3>
                      <p className="text-sm font-bold text-gray-400 flex items-center gap-1">
                        By <span className="text-[#5ba409]">{product.seller}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#5ba409]">₱{product.price}</p>
                      <p className="text-[10px] font-black text-gray-300 uppercase">per {product.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-gray-50 mb-6">
                      <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Stock Status</p>
                          <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-[#5ba409]" />
                              <span className="font-black text-gray-700">{product.stock} {product.unit}s</span>
                          </div>
                      </div>
                      <div className="flex-1 text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Listing Status</p>
                          <span className="text-[10px] font-black px-3 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-tighter">Verified</span>
                      </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-all">
                      <AlertTriangle className="w-4 h-4 text-red-400" /> Suspend
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all">
                      <XCircle className="w-4 h-4" /> De-list
                    </button>
                    <button title="Fast Approve" className="p-3 bg-green-50 text-[#5ba409] rounded-2xl hover:bg-[#5ba409] hover:text-white transition-all">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-5 border-4 border-dashed border-gray-100 rounded-[2.5rem] font-black text-gray-300 hover:border-[#5ba409] hover:text-[#5ba409] transition-all bg-white shadow-xl shadow-gray-100/50">
             Load More Marketplace Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminListingsPage;
