import React from 'react';
import { Search, Filter, MoreVertical, Edit2, ShieldAlert, CheckCircle2, UserPlus, Mail, MapPin } from 'lucide-react';
import { users } from '../../../data';
import type { UserData } from '../../../types';

const AdminUsersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">User Management</h1>
            <p className="text-lg text-gray-600">Monitor and manage all platform participants</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#5ba409] hover:bg-[#4d8f08] text-white px-6 py-3 rounded-2xl font-bold font-sm shadow-xl shadow-green-500/20 transition-all hover:-translate-y-0.5">
            <UserPlus className="w-5 h-5" /> Add New User
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-3xl shadow-lg shadow-green-900/5 border border-green-50 mb-8 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, email, or location..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-medium"
            />
          </div>
          <div className="flex gap-4">
            <select className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-600">
              <option value="">All Roles</option>
              <option value="farmer">Farmers</option>
              <option value="buyer">Buyers</option>
              <option value="admin">Admins</option>
            </select>
            <select className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-600">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-xs tracking-widest">User Details</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-xs tracking-widest">Account Type</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-xs tracking-widest">Location</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-xs tracking-widest">Verification</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: UserData, idx: number) => (
                  <tr key={idx} className="group border-b border-gray-50 hover:bg-green-50/20 transition-colors">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white ${
                           user.type === 'Farmer' ? 'bg-[#5ba409]' : 'bg-blue-500'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400 flex items-center mt-0.5 font-medium">
                            <Mail className="w-3 h-3 mr-1" /> {user.name.toLowerCase().replace(' ', '.')}@example.com
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        user.type === 'Farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-sm font-bold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#5ba409]" />
                        {user.location}
                      </div>
                    </td>
                    <td className="py-5 px-8">
                      <span className={`flex items-center gap-1.5 text-xs font-black ${
                        user.status === 'Active' ? 'text-[#5ba409]' : 'text-red-500'
                      }`}>
                        {user.status === 'Active' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Edit User" className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-[#5ba409] shadow-sm border border-transparent hover:border-green-100 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button title="Security Settings" className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 shadow-sm border border-transparent hover:border-red-100 transition-all">
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
            <p className="text-sm font-bold text-gray-400">Showing {users.length} unique platform participants</p>
            <div className="flex gap-2">
              <button className="px-5 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-black text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all">Previous</button>
              <button className="px-5 py-2 bg-white border-2 border-[#5ba409] rounded-xl text-sm font-black text-[#5ba409] hover:bg-green-50 transition-all">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
