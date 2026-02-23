import React from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, MapPin, Phone, Mail, Package } from 'lucide-react';
import { farmerOrders } from '../../../data';

const FarmerOrdersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Orders Management</h1>
            <p className="text-lg text-gray-600">Track and fulfill your customer orders</p>
          </div>
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
             <button className="px-6 py-2 bg-[#5ba409] text-white rounded-xl font-bold text-sm transition-all">All Orders</button>
             <button className="px-6 py-2 text-gray-500 hover:text-gray-900 rounded-xl font-bold text-sm transition-all">Pending</button>
             <button className="px-6 py-2 text-gray-500 hover:text-gray-900 rounded-xl font-bold text-sm transition-all">Completed</button>
          </div>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {farmerOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:border-[#5ba409] transition-all">
               <div className="flex flex-col lg:flex-row">
                  {/* Order Status & Info Sidebar */}
                  <div className={`p-6 lg:w-64 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100 ${
                    order.status === 'Pending' ? 'bg-yellow-50/50' : 
                    order.status === 'Confirmed' ? 'bg-blue-50/50' : 
                    'bg-green-50/50'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className={`w-5 h-5 ${
                           order.status === 'Pending' ? 'text-yellow-600' : 
                           order.status === 'Confirmed' ? 'text-blue-600' : 
                           'text-green-600'
                        }`} />
                        <span className="font-black text-gray-900 tracking-tight">{order.id}</span>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                         {order.status}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 lg:mt-0">
                       <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Amount</p>
                       <p className="text-3xl font-black text-[#5ba409]">{order.amount}</p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Product Details */}
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Product Details</h3>
                        <div className="flex items-start gap-4">
                          <div className="bg-[#F9FBE7] p-3 rounded-2xl">
                             <Package className="w-8 h-8 text-[#5ba409]" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-gray-900 mb-1">{order.product}</p>
                            <p className="font-semibold text-gray-600">Quantity: <span className="text-[#5ba409]">{order.qty}</span></p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Customer Details</h3>
                        <div className="space-y-3">
                          <p className="flex items-center gap-2 font-bold text-gray-900">
                             <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">👤</span>
                             {order.buyer}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-gray-500 font-semibold">
                             <MapPin className="w-4 h-4" />
                             Cebu City, Philippines
                          </p>
                          <div className="flex gap-4">
                             <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-[#5ba409] hover:bg-green-50 rounded-xl transition-all">
                               <Phone className="w-4 h-4" />
                             </a>
                             <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-[#5ba409] hover:bg-green-50 rounded-xl transition-all">
                               <Mail className="w-4 h-4" />
                             </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                       {order.status === 'Pending' && (
                         <>
                           <button className="flex items-center gap-2 px-6 py-2.5 bg-[#5ba409] hover:bg-[#4d8f08] text-white rounded-xl font-bold text-sm transition-all shadow-md">
                             <CheckCircle className="w-4 h-4" /> Confirm Order
                           </button>
                           <button className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-red-50 hover:bg-red-50 text-red-500 rounded-xl font-bold text-sm transition-all">
                             <XCircle className="w-4 h-4" /> Cancel
                           </button>
                         </>
                       )}
                       {order.status === 'Confirmed' && (
                          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#5ba409] hover:bg-[#4d8f08] text-white rounded-xl font-bold text-sm transition-all shadow-md">
                             <Package className="w-4 h-4" /> Ship Order
                          </button>
                       )}
                       <button className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-bold text-sm transition-all ml-auto">
                          View Details
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerOrdersPage;
