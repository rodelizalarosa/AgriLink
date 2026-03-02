import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Clock,
  User,
  Shield,
  ShoppingCart,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  RefreshCw,
  Package,
  Database,
  Activity,
} from 'lucide-react';

type Category = 'All' | 'User' | 'Orders' | 'Listings' | 'System' | 'Security';
type Severity = 'info' | 'success' | 'warning' | 'error';

interface LogEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  detail: string;
  category: Category;
  severity: Severity;
  ip: string;
  time: string;
  date: string;
}

const logs: LogEntry[] = [
  { id: 'LOG-021', user: 'Admin User',    role: 'Admin',     action: 'Suspended buyer account',       detail: 'Account #B-204 suspended for suspicious activity',              category: 'Security',  severity: 'warning', ip: '192.168.1.10', time: '2m ago',     date: 'Mar 1, 2026'  },
  { id: 'LOG-020', user: 'Admin User',    role: 'Admin',     action: 'Approved farmer listing',       detail: 'Listing #L-089 (Organic Tomatoes) approved for marketplace',     category: 'Listings',  severity: 'success', ip: '192.168.1.10', time: '8m ago',     date: 'Mar 1, 2026'  },
  { id: 'LOG-019', user: 'System',        role: 'System',    action: 'Scheduled backup completed',    detail: 'Full database snapshot saved to cloud storage',                  category: 'System',    severity: 'info',    ip: '127.0.0.1',    time: '15m ago',    date: 'Mar 1, 2026'  },
  { id: 'LOG-018', user: 'Brgy. Official',role: 'Brgy',      action: 'Awarded trust badge',           detail: 'Badge "Brgy. Verified" awarded to crop listing #L-081',          category: 'Listings',  severity: 'success', ip: '10.0.0.45',    time: '32m ago',    date: 'Mar 1, 2026'  },
  { id: 'LOG-017', user: 'Admin User',    role: 'Admin',     action: 'New user registered',           detail: 'Farmer account created for Ricardo Ramos',                      category: 'User',      severity: 'info',    ip: '192.168.1.10', time: '1h ago',     date: 'Mar 1, 2026'  },
  { id: 'LOG-016', user: 'System',        role: 'System',    action: 'Order auto-cancelled',          detail: 'Order #ORD-099 cancelled — no farmer confirmation after 48h',   category: 'Orders',    severity: 'warning', ip: '127.0.0.1',    time: '2h ago',     date: 'Mar 1, 2026'  },
  { id: 'LOG-015', user: 'Admin User',    role: 'Admin',     action: 'Rejected crop listing',         detail: 'Listing #L-078 rejected — missing quality photos',              category: 'Listings',  severity: 'error',   ip: '192.168.1.10', time: '3h ago',     date: 'Mar 1, 2026'  },
  { id: 'LOG-014', user: 'Admin User',    role: 'Admin',     action: 'Updated platform settings',     detail: 'Changed commission rate from 4% to 5%',                         category: 'System',    severity: 'warning', ip: '192.168.1.10', time: '5h ago',     date: 'Mar 1, 2026'  },
  { id: 'LOG-013', user: 'System',        role: 'System',    action: 'Payout batch processed',        detail: '18 farmers credited — total ₱152,400',                         category: 'Orders',    severity: 'success', ip: '127.0.0.1',    time: '6h ago',     date: 'Mar 1, 2026'  },
  { id: 'LOG-012', user: 'Brgy. Official',role: 'Brgy',      action: 'Added new farmer',              detail: 'Farmer profile created for Elena Garcia — Brgy San Jose',       category: 'User',      severity: 'info',    ip: '10.0.0.45',    time: 'Yesterday',  date: 'Feb 29, 2026' },
  { id: 'LOG-011', user: 'Admin User',    role: 'Admin',     action: 'Login from new device',         detail: 'Login from IP 203.22.11.5 — flagged as new location',           category: 'Security',  severity: 'warning', ip: '203.22.11.5',  time: 'Yesterday',  date: 'Feb 29, 2026' },
  { id: 'LOG-010', user: 'System',        role: 'System',    action: 'Failed login attempt',          detail: '5 consecutive failed logins for account #A-001',               category: 'Security',  severity: 'error',   ip: '89.44.22.11',  time: 'Yesterday',  date: 'Feb 29, 2026' },
  { id: 'LOG-009', user: 'Admin User',    role: 'Admin',     action: 'Reactivated user account',     detail: 'Account #B-198 Ana Garcia reactivated after review',            category: 'User',      severity: 'success', ip: '192.168.1.10', time: 'Feb 28',     date: 'Feb 28, 2026' },
  { id: 'LOG-008', user: 'System',        role: 'System',    action: 'Inventory sync completed',      detail: '142 products refreshed from all barangay databases',            category: 'System',    severity: 'info',    ip: '127.0.0.1',    time: 'Feb 28',     date: 'Feb 28, 2026' },
  { id: 'LOG-007', user: 'Admin User',    role: 'Admin',     action: 'Exported monthly report',       detail: 'Feb 2026 report downloaded — 3.8MB PDF',                        category: 'System',    severity: 'info',    ip: '192.168.1.10', time: 'Feb 27',     date: 'Feb 27, 2026' },
];

const CATEGORIES: Category[] = ['All', 'User', 'Orders', 'Listings', 'System', 'Security'];

const severityConfig: Record<Severity, { icon: React.ElementType; label: string; dot: string; text: string; bg: string }> = {
  info:    { icon: Info,          label: 'Info',    dot: 'bg-blue-400',   text: 'text-blue-600',   bg: 'bg-blue-50'   },
  success: { icon: CheckCircle,   label: 'Success', dot: 'bg-green-400',  text: 'text-green-600',  bg: 'bg-green-50'  },
  warning: { icon: AlertTriangle, label: 'Warning', dot: 'bg-amber-400',  text: 'text-amber-600',  bg: 'bg-amber-50'  },
  error:   { icon: XCircle,       label: 'Error',   dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50'    },
};

const categoryIcon: Record<string, React.ElementType> = {
  User: User, Orders: ShoppingCart, Listings: Package, System: Database, Security: Shield, All: Activity,
};

const roleColor: Record<string, string> = {
  Admin: 'bg-purple-100 text-purple-700',
  Brgy:  'bg-orange-100 text-orange-700',
  System:'bg-gray-100   text-gray-500',
};

const LogsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeSeverity, setActiveSeverity] = useState<Severity | 'All'>('All');

  const filtered = logs.filter(log => {
    const matchSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'All' || log.category === activeCategory;
    const matchSev = activeSeverity === 'All' || log.severity === activeSeverity;
    return matchSearch && matchCat && matchSev;
  });

  const counts = {
    info:    logs.filter(l => l.severity === 'info').length,
    success: logs.filter(l => l.severity === 'success').length,
    warning: logs.filter(l => l.severity === 'warning').length,
    error:   logs.filter(l => l.severity === 'error').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-black text-xs uppercase tracking-widest bg-purple-100/60 w-fit px-3 py-1.5 rounded-full border border-purple-200">
              <FileText className="w-3.5 h-3.5" /> Security &amp; Audit Trail
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Platform Logs</h1>
            <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
              Complete audit trail of all administrative actions, system events, and security alerts across AgriLink.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-black text-sm text-gray-500 hover:text-green-600 hover:bg-green-50 hover:border-green-200 transition-all shadow-xl shadow-gray-200/40">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button className="flex items-center gap-2 px-6 py-4 bg-gray-900 hover:bg-green-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-gray-900/20">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* ── Severity Summary Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {(['info', 'success', 'warning', 'error'] as Severity[]).map(sev => {
            const cfg = severityConfig[sev];
            const Icon = cfg.icon;
            const isActive = activeSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setActiveSeverity(isActive ? 'All' : sev)}
                className={`p-6 rounded-[2rem] border-2 text-left transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                  isActive
                    ? `${cfg.bg} border-current ${cfg.text}`
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-gray-200/50'
                }`}
              >
                <div className={`w-12 h-12 ${cfg.bg} ${cfg.text} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{cfg.label}</p>
                <h4 className="text-3xl font-black text-gray-900 mt-1">{counts[sev]}</h4>
                {isActive && <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Filtering active</p>}
              </button>
            );
          })}
        </div>

        {/* ── Log Table Card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50/50 overflow-hidden">

          {/* Toolbar */}
          <div className="p-8 border-b border-gray-100 flex flex-col lg:flex-row gap-5 items-start lg:items-center">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search logs by user, action, or ID..."
                className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-purple-500/30 focus:bg-white transition-all font-bold outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 flex-wrap shrink-0">
              {CATEGORIES.map(cat => {
                const CatIcon = categoryIcon[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                      activeCategory === cat
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" /> {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <div className="px-8 py-4 flex items-center gap-3 border-b border-gray-50">
            <Settings className="w-4 h-4 text-gray-300" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Showing <span className="text-gray-900">{filtered.length}</span> of {logs.length} entries
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Severity</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Timestamp</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Actor</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Action &amp; Detail</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest">Category</th>
                  <th className="py-5 px-8 font-black text-gray-400 uppercase text-[10px] tracking-widest text-right">ID / IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length > 0 ? filtered.map(log => {
                  const sev = severityConfig[log.severity];
                  const SevIcon = sev.icon;
                  const CatIcon = categoryIcon[log.category] ?? FileText;
                  return (
                    <tr key={log.id} className="group hover:bg-gray-50/60 transition-all cursor-pointer">
                      {/* Severity */}
                      <td className="py-5 px-8">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl w-fit ${sev.bg}`}>
                          <SevIcon className={`w-3.5 h-3.5 ${sev.text}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${sev.text}`}>{sev.label}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <div>
                            <p className="text-xs font-black text-gray-600">{log.time}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{log.date}</p>
                          </div>
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center font-black text-xs text-gray-500 shrink-0">
                            {log.user === 'System' ? '⚙' : log.user.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-none">{log.user}</p>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-widest ${roleColor[log.role] ?? 'bg-gray-100 text-gray-500'}`}>
                              {log.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-5 px-8 max-w-xs">
                        <p className="text-sm font-black text-gray-900 mb-1">{log.action}</p>
                        <p className="text-xs text-gray-400 font-medium leading-snug truncate max-w-[260px]">{log.detail}</p>
                      </td>

                      {/* Category */}
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-2xl w-fit">
                          <CatIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{log.category}</span>
                        </div>
                      </td>

                      {/* ID + IP */}
                      <td className="py-5 px-8">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono text-xs text-gray-400 group-hover:text-gray-900 transition-colors">{log.id}</span>
                          <span className="font-mono text-[10px] text-gray-300">{log.ip}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto mt-1" />
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="text-5xl mb-4">🔍</div>
                      <p className="font-black text-gray-400 text-lg">No logs match your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              Last refreshed: Mar 1, 2026 — 12:55 PM
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                Previous Page
              </button>
              <button className="px-6 py-3 bg-gray-900 hover:bg-green-700 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-gray-900/10">
                Next Page
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogsPage;
