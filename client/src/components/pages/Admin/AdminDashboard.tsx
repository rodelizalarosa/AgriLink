import React from 'react';
import { MapPin, Package, ShoppingCart, TrendingUp, Users, CheckCircle, XCircle, Shield, FileText } from 'lucide-react';
import { pendingFarmers } from '../../../data';
import DashboardCard from '../../ui/DashboardCard';
import type { FarmerApplication } from '../../../types';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#5ba409] font-black text-xs uppercase tracking-widest bg-green-100/50 w-fit px-3 py-1.5 rounded-full border border-green-200 mb-3">
            <Shield className="w-3.5 h-3.5" /> High-Level Oversight
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">Admin Overview</h1>
          <p className="text-lg text-gray-500 font-medium">Platform performance metrics and critical verification actions.</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            icon={Users}
            title="Total Ecosystem"
            value="4,289"
            subtitle="Participants"
            color="#5ba409"
            trend="+12% this month"
          />
          <DashboardCard
            icon={Package}
            title="Product Volume"
            value="12,500"
            subtitle="Units available"
            color="#FFC107"
            trend="+5% health"
          />
          <DashboardCard
            icon={ShoppingCart}
            title="Active Orders"
            value="892"
            subtitle="Processing"
            color="#2196F3"
            trend="High volume day"
          />
          <DashboardCard
            icon={TrendingUp}
            title="Platform GMV"
            value="₱2.4M"
            subtitle="Gross Value"
            color="#8D6E63"
            trend="+32% annual"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Pending Approvals Section */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 p-10 border border-green-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Farmer Registration Requests</h2>
                  <p className="text-gray-500 text-sm font-medium">New farmers awaiting platform verification and auditing</p>
                </div>
                <span className="bg-[#FFC107] text-white px-6 py-2.5 rounded-2xl font-black text-xs shadow-xl shadow-yellow-500/20 uppercase tracking-widest w-fit">
                  {pendingFarmers.length} PENDING
                </span>
              </div>
              
              <div className="space-y-4">
                {pendingFarmers.map((farmer: FarmerApplication, idx: number) => (
                  <div key={idx} className="group flex flex-col md:flex-row md:items-center justify-between p-6 border-2 border-gray-50 rounded-3xl hover:border-[#5ba409] hover:bg-green-50/30 transition-all duration-500">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-[1.25rem] bg-green-100 flex items-center justify-center text-[#5ba409] font-black text-xl shadow-lg shadow-green-500/10 group-hover:scale-110 transition-transform">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-[#5ba409] transition-colors">{farmer.name}</h3>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#5ba409]" />{farmer.location}</span>
                          <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-[#5ba409]" />{farmer.products}</span>
                        </div>
                        <p className="text-[10px] text-gray-300 mt-3 font-black uppercase tracking-tighter">Applied on {farmer.date}</p>
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0 flex items-center gap-3">
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#5ba409] hover:bg-[#4d8f08] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-500/20 hover:-translate-y-1 active:scale-95">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-500 border border-gray-100 hover:border-red-100 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#5ba409]" />
                Platform Logs
              </h3>
              <div className="space-y-8">
                {[
                  { user: 'Farmer Maria', action: 'added 50kg Mangoes', time: '2m ago' },
                  { user: 'Buyer Juan', action: 'placed order #ORD-99', time: '15m ago' },
                  { user: 'Admin System', action: 'automated backup complete', time: '1h ago' },
                  { user: 'LGU Rep', action: 'validated San Jose', time: '3h ago' },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5ba409] mt-2 group-first:animate-ping shadow-[0_0_10px_rgba(91,164,9,0.5)]"></div>
                    <div>
                      <p className="text-sm font-black text-gray-800 leading-tight">{log.user}</p>
                      <p className="text-xs font-medium text-gray-500 mt-1">{log.action}</p>
                      <p className="text-[10px] text-gray-300 mt-2 uppercase font-black tracking-widest">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-4 border-2 border-gray-50 rounded-[1.25rem] text-xs font-black text-gray-400 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase tracking-widest shadow-sm">
                View All System Logs
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
