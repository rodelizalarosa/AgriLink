import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertCircle,
  TrendingUp,
  Calendar,
  Camera,
  ShieldCheck,
  Leaf,
  Star,
  Users,
  UserCheck,
  ShieldAlert,
  Award,
  LayoutGrid,
  MapPin,
  Tag,
  CheckCircle,
  Zap,
  Medal,
  Crown,
  Sparkles
} from 'lucide-react';
import Modal from '../../ui/Modal';
import { sampleProducts, users } from '../../../data';

type PageView = 'listings' | 'badges';
type BadgeTarget = 'crop' | 'farmer';

interface AwardTarget {
  entityType: BadgeTarget;
  name: string;
  id?: number | string;
  image?: string;
  location?: string;
  seller?: string;
}

const CROP_BADGES = [
  { 
    id: 'fresh_pick', 
    label: 'Fresh Pick', 
    icon: Leaf, 
    desc: 'Meets freshness standards', 
    progress: 100, 
    reqs: [
      {title: 'Harvested within 24 hours', met: true}, 
      {title: 'Barangay Freshness Verified', met: true}
    ] 
  },
  { 
    id: 'premium_crop', 
    label: 'Premium Crop', 
    icon: Medal, 
    desc: 'High quality score', 
    progress: 75, 
    reqs: [
      {title: 'AI Phenotype Score > 8.0', met: true}, 
      {title: 'Uniform Size & Color', met: false}
    ] 
  },
  { 
    id: 'superior_harvest', 
    label: 'Superior Harvest', 
    icon: TrendingUp, 
    desc: 'Top quality + High demand', 
    progress: 50, 
    reqs: [
      {title: 'Top 10% Quality Score', met: true}, 
      {title: 'High Market Demand Status', met: false}
    ] 
  },
  { 
    id: 'crop_excellence', 
    label: 'Crop Excellence', 
    icon: Crown, 
    desc: 'Highest quality, limited edition', 
    progress: 30, 
    reqs: [
      {title: 'Perfect AI Phenotype Score', met: false}, 
      {title: 'Barangay Special Recognition', met: false}
    ] 
  },
];

const FARMER_BADGES = [
  { 
    id: 'rookie', 
    label: 'Rookie Farmer', 
    icon: UserCheck, 
    desc: 'Basic verification', 
    progress: 100, 
    reqs: [
      {title: 'Government ID Verified', met: true}, 
      {title: 'Farm Location Confirmed', met: true}
    ] 
  },
  { 
    id: 'skilled', 
    label: 'Skilled Farmer', 
    icon: Award, 
    desc: 'Consistent quality crops', 
    progress: 75, 
    reqs: [
      {title: '10+ Successful Sales', met: true}, 
      {title: '4.0+ Average Rating', met: false}
    ] 
  },
  { 
    id: 'master', 
    label: 'Master Farmer', 
    icon: Star, 
    desc: 'Top quality & sustainability', 
    progress: 40, 
    reqs: [
      {title: '50+ Sales Milestone', met: true}, 
      {title: 'Sustainable Practices Cert', met: false}
    ] 
  },
  { 
    id: 'legendary', 
    label: 'Legendary Farmer', 
    icon: Zap, 
    desc: 'Highest tier, exceptional', 
    progress: 10, 
    reqs: [
      {title: '200+ Sales Milestone', met: false}, 
      {title: 'Top 1% Barangay Seller', met: false}
    ] 
  },
];

const farmers = users.filter(u => u.type === 'Farmer');

const getBadgeIcon = (name: string, type: BadgeTarget) => {
  const badge = (type === 'crop' ? CROP_BADGES : FARMER_BADGES).find(b => b.label === name);
  return badge ? badge.icon : (type === 'crop' ? CheckCircle : UserCheck);
};

const BrgyListingsPage: React.FC = () => {
  const [pageView, setPageView] = useState<PageView>('listings');
  const [badgeView, setBadgeView] = useState<'crops' | 'farmers'>('crops');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [awardTarget, setAwardTarget] = useState<AwardTarget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('');

  React.useEffect(() => {
    if (awardTarget) {
      setSelectedBadgeId(awardTarget.entityType === 'crop' ? 'fresh_pick' : 'rookie');
    }
  }, [awardTarget]);

  const handleAward = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); setAwardTarget(null); }, 2100);
    }, 1500);
  };

  // Search crops across the barangay
  const filteredListings = sampleProducts.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const filteredCrops = sampleProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F8E9] via-white to-[#E8F5E9] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-700 font-black text-xs uppercase tracking-widest bg-green-100/60 w-fit px-3 py-1.5 rounded-full border border-green-200">
              <Package className="w-3.5 h-3.5" /> Barangay Crop Management
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Listings &amp; Badges</h1>
            <p className="text-lg text-gray-500 font-medium max-w-xl leading-relaxed">
              Browse registered harvests and grant trust certifications to crops and farmers in your barangay.
            </p>
          </div>

        </div>

        {/* ── Main Tab Switcher ────────────────────────────────────────── */}
        <div className="flex bg-white p-1.5 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 w-fit mb-10 gap-1">
          <button
            onClick={() => { setPageView('listings'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              pageView === 'listings'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className="w-5 h-5" /> Listings
          </button>
          <button
            onClick={() => { setPageView('badges'); setSearchTerm(''); setBadgeView('crops'); }}
            className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              pageView === 'badges'
                ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <Award className="w-5 h-5" /> Badges
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            LISTINGS GRID VIEW
        ════════════════════════════════════════════════════════════════ */}
        {pageView === 'listings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {[
                { label: 'Total Listings',  val: filteredListings.length.toString(), icon: Package,    color: 'text-green-600',  bg: 'bg-green-50'  },
                { label: 'Active Farmers',  val: farmers.length.toString(),  icon: TrendingUp, color: 'text-blue-600',   bg: 'bg-blue-50'   },
                { label: 'Certified Crops', val: filteredListings.filter(l => l.badges && l.badges.length > 0).length.toString(),  icon: Award, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <h4 className="text-3xl font-black text-gray-900">{s.val}</h4>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search crops or farmers..."
                  className="w-full pl-14 pr-6 py-4 bg-gray-50/50 rounded-2xl border-2 border-transparent focus:border-green-600 focus:bg-white transition-all font-bold outline-none"
                />
              </div>
            </div>

            {/* Listings Card Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(item => (
                  <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all overflow-hidden">
                    {/* Card Top */}
                    <div className="h-40 relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                      <div className="absolute top-4 left-4">
                        <span className="text-[9px] font-black bg-white/90 backdrop-blur-sm text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-gray-100">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-7">
                      <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{item.name}</h3>
                      <p className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> {item.seller}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-gray-50 p-3 rounded-2xl text-center">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock</p>
                          <p className="font-black text-gray-800 text-sm mt-0.5">{item.stock} {item.unit}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl text-center">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                          <p className="font-black text-green-600 text-sm mt-0.5">₱{item.price} / {item.unit}</p>
                        </div>
                      </div>

                      {/* Existing badges */}
                      {item.badges && item.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.badges.map((b, i) => {
                             const Icon = getBadgeIcon(b, 'crop');
                             return (
                               <span key={i} className="flex items-center gap-1.5 text-[9px] font-black bg-green-50 text-green-700 px-3 py-1.5 rounded-full uppercase tracking-widest mt-2 border border-green-200/50 shadow-sm transition-transform hover:scale-105">
                                 <Icon className="w-3 h-3" />{b}
                               </span>
                             );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-24 text-center border border-gray-100 shadow-xl shadow-gray-200/30">
                <div className="text-6xl mb-6">🌾</div>
                <p className="font-black text-gray-400 text-xl">No listings match your search.</p>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            BADGE GRID VIEW
        ════════════════════════════════════════════════════════════════ */}
        {pageView === 'badges' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Badge Header */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 p-8 mb-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center shrink-0">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-gray-900 mb-1">Trust Certification Center</h2>
                <p className="text-gray-400 font-bold text-sm">Select a crop or a farmer below to award a community trust badge. These badges are visible to all buyers on the marketplace.</p>
              </div>
              <div className="flex items-center gap-3 bg-green-50 px-6 py-4 rounded-2xl border border-green-100 shrink-0">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Badges Issued</p>
                  <p className="text-xl font-black text-green-700">128 Active</p>
                </div>
              </div>
            </div>

            {/* Crops / Farmers Sub-Toggle + Search */}
            <div className="flex flex-col md:flex-row gap-5 mb-8">
              <div className="flex bg-white p-1.5 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 shrink-0">
                <button
                  onClick={() => { setBadgeView('crops'); setSearchTerm(''); }}
                  className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    badgeView === 'crops' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Package className="w-4 h-4" /> Crop Listings
                </button>
                <button
                  onClick={() => { setBadgeView('farmers'); setSearchTerm(''); }}
                  className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    badgeView === 'farmers' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Users className="w-4 h-4" /> Local Farmers
                </button>
              </div>

              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={badgeView === 'crops' ? 'Search crop or seller...' : 'Search farmer or location...'}
                  className="w-full pl-16 pr-6 py-4 bg-white rounded-3xl border-2 border-gray-100 shadow-xl shadow-gray-200/40 font-bold outline-none transition-all focus:border-green-600"
                />
              </div>
            </div>

            {/* ── Crops Badge Grid ── */}
            {badgeView === 'crops' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {filteredCrops.map(product => (
                  <div key={product.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all overflow-hidden">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-xl font-black text-white">{product.name}</h3>
                        <p className="text-sm font-bold text-white/70 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />{product.seller}
                        </p>
                      </div>
                      {/* Existing badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                        {product.badges?.map((b, i) => {
                          const Icon = getBadgeIcon(b, 'crop');
                          return (
                            <span key={i} className="bg-white/95 backdrop-blur-md text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl text-green-700 flex items-center gap-1.5 border border-green-100 animate-in slide-in-from-left duration-300">
                              <Icon className="w-3.5 h-3.5" />{b}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="p-7">
                      <div className="flex justify-between items-end mb-5">
                        <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Stock</p>
                          <p className="font-black text-gray-700">{product.stock} {product.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Location</p>
                          <p className="text-sm font-bold text-gray-500 flex items-center gap-1 justify-end">
                            <MapPin className="w-3 h-3" />{product.location}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAwardTarget({ entityType: 'crop', name: product.name, id: product.id, seller: product.seller })}
                        className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-green-500/20"
                      >
                        <ShieldCheck className="w-4 h-4" /> Certify This Harvest
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Farmers Badge Grid ── */}
            {badgeView === 'farmers' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {filteredFarmers.map((farmer, idx) => (
                  <div key={idx} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all p-8">
                    <div className="flex items-start justify-between mb-7">
                      <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner group-hover:scale-110 transition-transform text-3xl font-black">
                        {farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {farmer.badges?.map((b, i) => {
                          const Icon = getBadgeIcon(b, 'farmer');
                          return (
                            <span key={i} className="text-[9px] font-black bg-white border border-green-100 text-green-600 px-3.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm hover:shadow-md transition-shadow">
                              <Icon className="w-3 h-3" />{b}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-green-700 transition-colors uppercase tracking-tight">{farmer.name}</h3>
                      <p className="text-sm font-bold text-gray-400 flex items-center gap-1.5 italic">
                        <MapPin className="w-3.5 h-3.5" /> {farmer.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-7">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Goods</p>
                        <p className="text-lg font-black text-gray-700">12 items</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                        <p className="text-lg font-black text-gray-700">6mo ago</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setAwardTarget({ entityType: 'farmer', name: farmer.name, id: idx, location: farmer.location })}
                      className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 group-hover:shadow-green-500/20"
                    >
                      <Award className="w-4 h-4" /> Certify This Farmer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Submit Crop Modal ────────────────────────────────────────── */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Submit Local Harvest">
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); setIsAddModalOpen(false); alert('Crop submitted for LGU approval! 🌾'); }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Crop Name</label>
              <input type="text" className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="e.g. Red Onions" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity</label>
                <input type="text" className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="100kg" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Price / Unit</label>
                <input type="text" className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl outline-none transition-all font-bold" placeholder="₱45/kg" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Farmer</label>
              <select className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700">
                <option>Select Farmer</option>
                <option>Mang Jose</option>
                <option>Maria Santos</option>
                <option>Ricardo Ramos</option>
              </select>
            </div>
            <div className="p-8 border-4 border-dashed border-gray-100 rounded-[2rem] text-center hover:border-green-600 transition-all cursor-pointer bg-gray-50/30 group">
              <Camera className="w-10 h-10 text-gray-300 group-hover:text-green-600 transition-colors mx-auto mb-2" />
              <p className="text-sm font-black text-gray-400 group-hover:text-gray-900">Upload Crop Images</p>
              <p className="text-[10px] text-gray-300 uppercase tracking-tighter">Required for LGU Validation</p>
            </div>
          </div>
          <button type="submit" className="w-full py-5 bg-green-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-green-500/30 hover:-translate-y-1 transition-all">
            Submit to LGU
          </button>
        </form>
      </Modal>

      {/* ── Award Badge Modal ────────────────────────────────────────── */}
      <Modal
        isOpen={!!awardTarget}
        onClose={() => setAwardTarget(null)}
        title={`Award Badge — ${awardTarget?.entityType === 'crop' ? 'Crop' : 'Farmer'}: ${awardTarget?.name}`}
      >
        {showSuccess ? (
          <div className="text-center py-12 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trust Badge Awarded!</h2>
            <p className="text-gray-500 font-medium mt-2">Successfully certified <strong>{awardTarget?.name}</strong></p>
          </div>
        ) : (
          <form onSubmit={handleAward} className="space-y-7">
            {/* Entity Info Preview */}
            {awardTarget?.entityType === 'crop' && (() => {
               const crop = sampleProducts.find(c => c.id === awardTarget.id);
               if (!crop) return null;
               return (
                 <div className="flex bg-white border border-gray-100 shadow-lg shadow-gray-200/30 rounded-2xl p-3 gap-4 items-center">
                   <img src={crop.image} alt={crop.name} className="w-16 h-16 rounded-xl object-cover" />
                   <div className="flex-1">
                     <h4 className="text-base font-black text-gray-900 leading-tight mb-0.5">{crop.name}</h4>
                     <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1 mb-1.5">
                       <Users className="w-3 h-3" /> {crop.seller}
                     </p>
                     <div className="flex gap-2">
                       <span className="text-[9px] bg-green-50 text-green-700 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-green-100">
                         ₱{crop.price} / {crop.unit}
                       </span>
                       <span className="text-[9px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-gray-100">
                         Stock: {crop.stock} {crop.unit}
                       </span>
                     </div>
                   </div>
                 </div>
               );
            })()}

            {awardTarget?.entityType === 'farmer' && (() => {
               const farmer = farmers[awardTarget.id as number];
               if (!farmer) return null;
               return (
                 <div className="flex bg-white border border-gray-100 shadow-lg shadow-gray-200/30 rounded-2xl p-3 gap-4 items-center">
                   <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner text-2xl font-black">
                     {farmer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                   </div>
                   <div className="flex-1">
                     <h4 className="text-base font-black text-gray-900 leading-tight mb-0.5">{farmer.name}</h4>
                     <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1 mb-1.5 italic">
                       <MapPin className="w-3 h-3" /> {farmer.location}
                     </p>
                     <div className="flex gap-2">
                       <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-blue-100">
                         Active Seller
                       </span>
                     </div>
                   </div>
                 </div>
               );
            })()}

            {/* Context */}
            <div className={`p-4 rounded-2xl border flex items-start gap-4 ${awardTarget?.entityType === 'crop' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
              <ShieldAlert className={`w-5 h-5 mt-0.5 shrink-0 ${awardTarget?.entityType === 'crop' ? 'text-green-600' : 'text-blue-600'}`} />
              <div>
                <h4 className="font-black text-gray-900 text-sm">Official Certification</h4>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
                  You are awarding a trust badge to <strong>{awardTarget?.name}</strong>.
                  This badge will be published in the regional trust registry and visible to all buyers.
                </p>
              </div>
            </div>

            {/* Badge picker */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Badge Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(awardTarget?.entityType === 'crop' ? CROP_BADGES : FARMER_BADGES).map(badge => (
                  <label key={badge.id} className="cursor-pointer group">
                    <input type="radio" name="badgeType" className="peer hidden"
                      checked={selectedBadgeId === badge.id}
                      onChange={() => setSelectedBadgeId(badge.id)} />
                    <div className="p-5 border-2 border-gray-100 rounded-2xl group-hover:border-green-300 transition-all bg-white peer-checked:border-green-600 peer-checked:bg-green-50/50">
                      <badge.icon className="w-5 h-5 text-gray-400 mb-2 group-hover:text-green-600 peer-checked:text-green-600 transition-colors" />
                      <h5 className="font-black text-gray-900 text-xs">{badge.label}</h5>
                      <p className="text-[10px] text-gray-400 font-bold">{badge.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Qualification Progress */}
            {selectedBadgeId && (() => {
              const activeBadge = (awardTarget?.entityType === 'crop' ? CROP_BADGES : FARMER_BADGES).find(b => b.id === selectedBadgeId);
              if (!activeBadge) return null;
              
              const isQualified = activeBadge.progress === 100;

              return (
                <div className={`p-5 rounded-2xl border flex flex-col gap-4 animate-in fade-in duration-300 ${isQualified ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                  <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                       {isQualified ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-orange-600" />}
                       <h4 className={`font-black text-sm uppercase tracking-widest ${isQualified ? 'text-green-700' : 'text-orange-700'}`}>
                          {isQualified ? 'Requirements Met' : 'Requirements Pending'}
                       </h4>
                    </div>
                    <span className={`text-xl font-black ${isQualified ? 'text-green-700' : 'text-orange-700'}`}>{activeBadge.progress}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden pointer-events-none">
                    <div className={`h-full rounded-full transition-all duration-1000 ${isQualified ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${activeBadge.progress}%` }}></div>
                  </div>

                  {/* Requirements List */}
                  <div className="space-y-3 mt-1">
                    {activeBadge.reqs.map((req, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs font-bold w-full bg-white/40 p-2.5 rounded-xl border border-white/50 shadow-sm shadow-gray-200/30">
                        {req.met ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 shadow-md shadow-green-500/20 flex items-center justify-center shrink-0">
                             <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center shrink-0">
                             <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                          </div>
                        )}
                        <span className={`text-sm tracking-tight leading-tight mt-0.5 ${req.met ? 'text-green-900' : 'text-gray-600'}`}>{req.title}</span>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })()}

            {/* Justification */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Justification / Notes</label>
              <textarea
                required
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-600 rounded-2xl outline-none transition-all font-bold text-sm h-28 resize-none"
                placeholder="Record why this badge is being issued for the audit trail..."
              />
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setAwardTarget(null)}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-[2] py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/20 transition-all disabled:opacity-50">
                {isSubmitting ? 'Processing...' : 'Issue Badge'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default BrgyListingsPage;
