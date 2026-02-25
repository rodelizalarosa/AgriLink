import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit2, ShieldAlert, CheckCircle2, UserPlus, Mail, MapPin, User, Shield, Users } from 'lucide-react';
import { users } from '../../../data';
import type { UserData } from '../../../types';
import Modal from '../../ui/Modal';
import DashboardCard from '../../ui/DashboardCard';

interface AdminUsersPageProps {
  viewerRole?: string;
}

const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ viewerRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isBrgy = viewerRole?.toLowerCase() === 'brgy_official';
  
  // Filter users based on viewer role
  const displayedUsers = isBrgy 
    ? users.filter(user => user.type === 'Farmer')
    : users;

  const isLGU = viewerRole?.toLowerCase() === 'lgu_official';

  // Stats calculation
  const totalUsers = users.length;
  const totalFarmers = users.filter(u => u.type === 'Farmer').length;
  const totalBuyers = users.filter(u => u.type === 'Buyer').length;
  const totalBrgy = users.filter(u => u.type === 'Barangay Official' || u.type === 'Brgy Official').length;
  const totalLgu = users.filter(u => u.type === 'LGU Official').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#5ba409] font-black text-xs uppercase tracking-widest bg-green-100/50 w-fit px-3 py-1.5 rounded-full border border-green-200">
              <Users className="w-3.5 h-3.5" /> Platform Governance
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">
              {isBrgy ? 'Farmer Outreach' : 'User Management'}
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-xl">
              {isBrgy 
                ? 'Coordinate and assist local farmers with their crop listings and marketplace verification.' 
                : 'Monitor, moderate, and manage all platform participants and agricultural stakeholders.'}
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-[#5ba409] hover:bg-[#4d8f08] text-white px-8 py-6 rounded-[2.5rem] font-black text-lg transition-all shadow-2xl shadow-green-500/30 hover:-translate-y-2 active:scale-95"
          >
            <UserPlus className="w-6 h-6" /> Add New User
          </button>
        </div>

        {/* Quick Stats - Only for Admin/LGU */}
        {(isLGU || !isBrgy) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <DashboardCard
              icon={User}
              title="Farmers"
              value={totalFarmers.toString()}
              subtitle="Active producers"
              color="#2E7D32"
              trend="Local participants"
            />
            <DashboardCard
              icon={Users}
              title="Buyers"
              value={totalBuyers.toString()}
              subtitle="Active consumers"
              color="#1976D2"
              trend="Marketplace active"
            />
            <DashboardCard
              icon={Shield}
              title="Brgy Officials"
              value={totalBrgy.toString()}
              subtitle="Local administrators"
              color="#F57C00"
              trend="Verification team"
            />
            <DashboardCard
              icon={ShieldAlert}
              title="LGU Officials"
              value={totalLgu.toString()}
              subtitle="Municipal Governance"
              color="#006064"
              trend="Strategic oversight"
            />
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 mb-8 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name, email, or location..." 
              className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-[#5ba409] focus:bg-white transition-all font-bold outline-none"
            />
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            {!isBrgy && (
              <select className="flex-1 lg:flex-none px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl font-bold text-gray-600 outline-none hover:bg-white transition-all">
                <option value="">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="buyer">Buyers</option>
                <option value="admin">Admins</option>
              </select>
            )}
            <select className="flex-1 lg:flex-none px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl font-bold text-gray-600 outline-none hover:bg-white transition-all">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <button className="p-4 bg-gray-50 hover:bg-white border border-gray-100 rounded-2xl text-gray-600 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-6 px-10 font-black text-gray-400 uppercase text-xs tracking-widest">User Details</th>
                  <th className="py-6 px-10 font-black text-gray-400 uppercase text-xs tracking-widest text-center">Account Type</th>
                  <th className="py-6 px-10 font-black text-gray-400 uppercase text-xs tracking-widest">Location</th>
                  <th className="py-6 px-10 font-black text-gray-400 uppercase text-xs tracking-widest">Verification</th>
                  <th className="py-6 px-10 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayedUsers.map((user: UserData, idx: number) => (
                  <tr key={idx} className="group hover:bg-green-50/20 transition-all duration-300">
                    <td className="py-8 px-10">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-white shadow-lg transition-transform group-hover:scale-110 ${
                           user.type === 'Farmer' ? 'bg-[#5ba409] shadow-green-500/20' : 
                           user.type === 'LGU Official' ? 'bg-[#006064] shadow-cyan-500/20' :
                           user.type === 'Barangay Official' || user.type === 'Brgy Official' ? 'bg-[#F57C00] shadow-orange-500/20' :
                           'bg-blue-500 shadow-blue-500/20'
                        }`}>
                          {user.type === 'Farmer' ? <User className="w-6 h-6" /> : 
                           user.type === 'LGU Official' ? <Shield className="w-6 h-6" /> :
                           user.type === 'Barangay Official' || user.type === 'Brgy Official' ? <Shield className="w-6 h-6" /> :
                           <Users className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-lg font-black text-gray-900 leading-tight group-hover:text-[#5ba409] transition-colors">{user.name}</p>
                          <p className="text-sm font-bold text-gray-400 flex items-center mt-1">
                            <Mail className="w-3.5 h-3.5 mr-1.5" /> {user.name.toLowerCase().replace(' ', '.')}@example.com
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <div className="flex justify-center">
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                          user.type === 'Farmer' ? 'bg-green-100 text-green-700' : 
                          user.type === 'LGU Official' ? 'bg-cyan-100 text-cyan-700' :
                          user.type === 'Barangay Official' || user.type === 'Brgy Official' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {user.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-[#5ba409]" />
                        </div>
                        <span className="text-sm font-black text-gray-700">{user.location}</span>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                        user.status === 'Active' ? 'text-[#5ba409]' : 'text-red-500'
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${user.status === 'Active' ? 'bg-[#5ba409]' : 'bg-red-500'}`} />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-8 px-10 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                        <button title="Edit User" className="p-3 bg-white hover:bg-green-50 rounded-2xl text-gray-400 hover:text-[#5ba409] shadow-sm border border-gray-100 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button title="Security Settings" className="p-3 bg-white hover:bg-red-50 rounded-2xl text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 transition-all">
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                        <button className="p-3 bg-white hover:bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-10 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between border-t border-gray-50 gap-6">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Showing {displayedUsers.length} system participants</p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">Previous Page</button>
              <button className="px-8 py-3 bg-white border-2 border-[#5ba409] rounded-2xl text-sm font-black text-[#5ba409] hover:bg-[#5ba409] hover:text-white transition-all shadow-xl shadow-green-500/10">Next Page</button>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Add New Participant"
        >
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); alert('User created successfully! 👤'); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                <input type="text" className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="Juan" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                <input type="text" className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="Dela Cruz" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="juan@example.com" required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role Selection</label>
              <div className="grid grid-cols-3 gap-3">
                {['Farmer', 'Buyer', 'Brgy Official'].map(role => (
                  <button key={role} type="button" className="py-4 rounded-2xl border-2 border-gray-100 font-black hover:border-[#5ba409] hover:bg-green-50 transition-all text-[10px] text-gray-600 uppercase tracking-widest">
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Location</label>
              <input type="text" className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent focus:border-[#5ba409] focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="Barangay San Jose" required />
            </div>

            <button type="submit" className="w-full py-5 bg-[#5ba409] text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-green-500/30 hover:-translate-y-1 transition-all mt-4 uppercase tracking-tighter">
              Create Account
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsersPage;
