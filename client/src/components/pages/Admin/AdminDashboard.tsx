import React from 'react';
import { MapPin, Package, ShoppingCart, TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';
import { pendingFarmers } from '../../../data';
import DashboardCard from '../../ui/DashboardCard';
import type { FarmerApplication } from '../../../types';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Admin Overview</h1>
          <p className="text-lg text-gray-600">Platform performance and critical actions</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            icon={Users}
            title="Total Ecosystem"
            value="4,289"
            subtitle="Farmers, Buyers, Logistics"
            color="#5ba409"
            trend="+12% since last month"
          />
          <DashboardCard
            icon={Package}
            title="Product Volume"
            value="12,500"
            subtitle="Units available platform-wide"
            color="#FFC107"
            trend="+5% inventory health"
          />
          <DashboardCard
            icon={ShoppingCart}
            title="Active Orders"
            value="892"
            subtitle="Currently processing"
            color="#2196F3"
            trend="High volume today"
          />
          <DashboardCard
            icon={TrendingUp}
            title="Platform GMV"
            value="₱2.4M"
            subtitle="Gross Merchandise Value"
            color="#8D6E63"
            trend="+32% annual growth"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Approvals Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 p-8 border border-green-50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Farmer Registration Requests</h2>
                  <p className="text-gray-500">New farmers awaiting platform verification</p>
                </div>
                <span className="bg-[#FFC107] text-white px-5 py-2 rounded-2xl font-black text-sm shadow-lg shadow-yellow-500/20">
                  {pendingFarmers.length} PENDING
                </span>
              </div>
              
              <div className="space-y-4">
                {pendingFarmers.map((farmer: FarmerApplication, idx: number) => (
                  <div key={idx} className="group flex flex-col md:flex-row md:items-center justify-between p-5 border-2 border-gray-50 rounded-2xl hover:border-[#5ba409] hover:bg-green-50/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-[#5ba409] font-black">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#5ba409] transition-colors">{farmer.name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-[#5ba409]" />{farmer.location}</span>
                          <span className="flex items-center"><Package className="w-3.5 h-3.5 mr-1 text-[#5ba409]" />{farmer.products}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 font-medium">Applied on {farmer.date}</p>
                      </div>
                    </div>
                    <div className="mt-5 md:mt-0 flex items-center gap-3">
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#5ba409] hover:bg-[#4d8f08] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 hover:-translate-y-0.5">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border-2 border-red-50 hover:border-red-100 px-5 py-2.5 rounded-xl font-bold transition-all">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Platform Logs</h3>
              <div className="space-y-5">
                {[
                  { user: 'Farmer Maria', action: 'added 50kg Mangoes', time: '2m ago' },
                  { user: 'Buyer Juan', action: 'placed order #ORD-99', time: '15m ago' },
                  { user: 'Admin System', action: 'automated backup complete', time: '1h ago' },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#5ba409] mt-2"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.action}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-black tracking-wider">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 border-2 border-gray-50 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
                View All Audit Logs
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
