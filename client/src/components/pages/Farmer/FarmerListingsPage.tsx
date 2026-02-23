import React from 'react';
import { Package, Search, Filter, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { sampleProducts } from '../../../data';

const FarmerListingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">My Listings</h1>
            <p className="text-lg text-gray-600">Manage your farm inventory and prices</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-10 pr-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] outline-none transition-all w-64 font-semibold"
              />
            </div>
            <button className="p-2 border-2 border-gray-100 rounded-xl hover:border-[#5ba409] transition-all bg-white">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Listings Table/Grid */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left py-5 px-6 font-bold text-gray-700">Product Details</th>
                  <th className="text-left py-5 px-6 font-bold text-gray-700">Category</th>
                  <th className="text-left py-5 px-6 font-bold text-gray-700">Stock Level</th>
                  <th className="text-left py-5 px-6 font-bold text-gray-700">Price</th>
                  <th className="text-left py-5 px-6 font-bold text-gray-700">Status</th>
                  <th className="text-right py-5 px-6 font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sampleProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F9FBE7]/30 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                           {product.image.startsWith('http') || product.image.includes('.') ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl bg-white">{product.image}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-[#5ba409] transition-colors">{product.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <Package className="w-3 h-3" />
                            ID: #PROD-{product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                          {product.stock} {product.unit}
                        </p>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-[#5ba409]'}`} 
                            style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-black text-[#5ba409] text-lg">
                      ₱{product.price}
                      <span className="text-xs text-gray-400 font-bold ml-1 uppercase">/ {product.unit}</span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-black">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#5ba409] hover:bg-green-50 rounded-xl transition-all" title="Edit Listing">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="View in Marketplace">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete Listing">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerListingsPage;
