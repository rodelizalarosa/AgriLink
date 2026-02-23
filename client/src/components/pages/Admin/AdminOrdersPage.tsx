import React from 'react';
import { Search, Filter, ShoppingCart, Clock, CheckCircle2, Truck, MoreHorizontal, DollarSign, ArrowUpRight } from 'lucide-react';
import { farmerOrders } from '../../../data';
import type { OrderItem } from '../../../types';

const AdminOrdersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
               <h1 className="text-4xl font-black text-gray-900 mb-2">Platform Orders</h1>
               <p className="text-lg text-gray-600">Track and manage every transaction across the ecosystem</p>
            </div>
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Today Orders', value: '154', icon: ShoppingCart, color: 'bg-blue-500' },
            { label: 'Active Delivery', value: '42', icon: Truck, color: 'bg-[#5ba409]' },
            { label: 'Escalated/Dispute', value: '3', icon: Clock, color: 'bg-red-500' },
            { label: 'Total Revenue Today', value: '₱58,420', icon: DollarSign, color: 'bg-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 leading-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Global Filter */}
        <div className="bg-white p-4 rounded-3xl shadow-lg shadow-green-900/5 border border-green-50 mb-8 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by order ID, buyer, or farmer..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-4">
             <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all">
                <Filter className="w-4 h-4" /> Logistics Hub
             </button>
             <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black shadow-lg shadow-gray-900/20 hover:bg-black transition-all">
                Search
             </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-gray-900">Real-time Order Stream</h2>
             <span className="flex items-center gap-2 text-xs font-black text-[#5ba409] uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#5ba409] animate-pulse"></div>
                Live Updates Active
             </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Order ID</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Client & Seller</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Product Details</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Amount</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest text-center">Flow Status</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">Control</th>
                </tr>
              </thead>
              <tbody>
                {farmerOrders.map((order: OrderItem, idx: number) => (
                  <tr key={idx} className="group border-b border-gray-50 hover:bg-green-50/20 transition-all">
                    <td className="py-6 px-8">
                       <span className="font-black text-gray-900 text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg">{order.id}</span>
                    </td>
                    <td className="py-6 px-8">
                       <div className="flex flex-col gap-1">
                          <p className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> {order.buyer}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 ml-3 uppercase">Buying from <span className="text-[#5ba409]">Local Farmer</span></p>
                       </div>
                    </td>
                    <td className="py-6 px-8">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                             <ShoppingCart className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-gray-800">{order.product}</p>
                             <p className="text-xs text-[#5ba409] font-black uppercase">{order.qty}</p>
                          </div>
                       </div>
                    </td>
                    <td className="py-6 px-8 text-center text-sm font-black text-gray-900">
                       {order.amount}
                    </td>
                    <td className="py-6 px-8">
                       <div className="flex flex-col items-center gap-2">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                          <div className="flex gap-1">
                             {[1, 2, 3].map((s) => (
                                <div key={s} className={`h-1 w-4 rounded-full ${
                                   (order.status === 'Delivered' || (order.status === 'Confirmed' && s <= 2) || (order.status === 'Pending' && s <= 1)) 
                                   ? 'bg-[#5ba409]' : 'bg-gray-100'
                                }`}></div>
                             ))}
                          </div>
                       </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#5ba409] hover:border-[#5ba409] shadow-sm transition-all">
                             <ArrowUpRight className="w-4 h-4" />
                          </button>
                          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 hover:border-gray-200 shadow-sm">
                             <MoreHorizontal className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-10 bg-gray-50/30 text-center border-t border-gray-50">
             <button className="font-black text-gray-400 hover:text-[#5ba409] transition-colors text-sm uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                <Clock className="w-4 h-4" /> View full platform transaction history
             </button>
          </div>
        </div>
      </div>
  );
};

export default AdminOrdersPage;
