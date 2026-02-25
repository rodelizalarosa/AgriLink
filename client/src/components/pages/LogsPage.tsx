import React from 'react';
import { FileText, Search, Filter, Clock, Download, ChevronRight } from 'lucide-react';

const LogsPage: React.FC = () => {
  const logs = [
    { id: 'LOG-001', user: 'LGU_Juan', action: 'validated San Jose listings', time: '10m ago', category: 'Validation' },
    { id: 'LOG-002', user: 'LGU_Officer_9', action: 'resolved inquiry #445', time: '1h ago', category: 'Support' },
    { id: 'LOG-003', user: 'System_LGU', action: 'payout batch authorized', time: '3h ago', category: 'Financial' },
    { id: 'LOG-004', user: 'Admin_Sarah', action: 'updated system configuration', time: '5h ago', category: 'System' },
    { id: 'LOG-005', user: 'Brgy_Official_1', action: 'added new farmer: Benito Ramos', time: 'Yesterday', category: 'User Management' },
    { id: 'LOG-006', user: 'System_Audit', action: 'database backup completed', time: 'Yesterday', category: 'System' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#5ba409] font-black text-xs mb-3 uppercase tracking-widest bg-green-100/50 w-fit px-3 py-1.5 rounded-full border border-green-200">
              <FileText className="w-4 h-4" />
              Security & Audit
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">Platform Activity Logs</h1>
            <p className="text-lg text-gray-500 font-medium">Real-time audit trail of all platform-wide administrative actions.</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:scale-105 transition-all">
            <Download className="w-4 h-4" /> Export Audit Trail
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50/50 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white sticky top-0 z-10">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search logs by user or action..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-bold" 
              />
            </div>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-white border border-gray-100 rounded-xl transition-all shadow-sm font-black text-xs uppercase tracking-widest text-gray-600">
                 <Filter className="w-4 h-4" /> Filter Category
               </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Timestamp</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">User Entity</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Performed Action</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">Identifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log, idx) => (
                  <tr key={idx} className="group hover:bg-green-50/20 transition-all">
                    <td className="py-6 px-8">
                       <div className="flex items-center gap-2 text-gray-400">
                         <Clock className="w-3.5 h-3.5" />
                         <span className="text-xs font-bold uppercase tracking-wider">{log.time}</span>
                       </div>
                    </td>
                    <td className="py-6 px-8">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[#5ba409] font-black text-xs">
                             {log.user.charAt(0)}
                          </div>
                          <span className="text-sm font-black text-gray-900">{log.user}</span>
                       </div>
                    </td>
                    <td className="py-6 px-8">
                       <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-700">{log.action}</p>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-[#5ba409] bg-green-50 px-2 py-0.5 rounded-full w-fit">{log.category}</span>
                       </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                       <div className="flex items-center justify-end gap-2 text-gray-300">
                          <span className="text-xs font-mono">{log.id}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-gray-50/30 text-center border-t border-gray-50">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">End of recent activity trail</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
