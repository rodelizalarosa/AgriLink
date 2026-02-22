import React from 'react';
import { MapPin, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { pendingFarmers, users } from '../../data';
import DashboardCard from '../ui/DashboardCard';

const AdminPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-lg text-gray-600">LGU Marketplace Management</p>
        </div>

        {/* Admin Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={Users}
            title="Total Users"
            value="2,456"
            subtitle="456 farmers, 2k buyers"
            color="#5ba409"
          />
          <DashboardCard
            icon={Package}
            title="Active Listings"
            value="1,234"
            subtitle="89 pending approval"
            color="#FFC107"
          />
          <DashboardCard
            icon={ShoppingCart}
            title="Total Orders"
            value="5,678"
            subtitle="234 today"
            color="#2196F3"
            trend="+18% this week"
          />
          <DashboardCard
            icon={TrendingUp}
            title="Platform Revenue"
            value="₱125k"
            subtitle="This month"
            color="#8D6E63"
            trend="+25% from last month"
          />
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Farmer Approvals</h2>
            <span className="bg-[#FFC107] text-white px-4 py-2 rounded-full font-bold text-sm">
              8 Pending
            </span>
          </div>
          <div className="space-y-4">
            {pendingFarmers.map((farmer, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-[#5ba409] transition-colors">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{farmer.name}</h3>
                  <p className="text-gray-600"><MapPin className="inline w-4 h-4 mr-1" />{farmer.location}</p>
                  <p className="text-sm text-gray-500">Products: {farmer.products}</p>
                  <p className="text-xs text-gray-400 mt-1">Applied: {farmer.date}</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                  <button className="bg-[#5ba409] hover:bg-[#4d8f08] text-white px-4 py-2 rounded-lg font-semibold">
                    Approve
                  </button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Type</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Location</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#F9FBE7] transition-colors">
                    <td className="py-4 px-4 font-semibold">{user.name}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        user.type === 'Farmer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{user.location}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-[#5ba409] hover:text-[#4d8f08] font-semibold mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-800 font-semibold">Manage</button>
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

export default AdminPanel;
