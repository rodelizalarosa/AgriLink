import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Leaf, 
  Star, 
  Package, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
  Store,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sampleProducts, users } from '../../../data';
import Modal from '../../ui/Modal';

const BrgyAwardBadgePage: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'crops' | 'farmers'>('crops');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<any>(null); // Can be product or user
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAward = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedEntity(null);
      }, 2000);
    }, 1500);
  };

  const filteredProducts = sampleProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.seller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFarmers = users.filter(u => u.type === 'Farmer' && (
     u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.location.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/brgy-dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-green-600 font-black text-xs mb-4 uppercase tracking-widest transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Trust Verification Center</h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl leading-relaxed">
              Award community trust badges to certified local harvests and producers. These indicators protect our community and reward quality.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-2 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 flex items-center gap-2">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div className="pr-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Badges</p>
                  <p className="text-xl font-black text-gray-900">128 Issued</p>
               </div>
            </div>
          </div>
        </div>

        {/* View Switcher & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
           <div className="flex bg-white p-1.5 rounded-4xl shadow-xl shadow-gray-200/40 border border-gray-100 shrink-0">
             <button 
                onClick={() => { setViewType('crops'); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${viewType === 'crops' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <Package className="w-5 h-5" /> Crop Listings
             </button>
             <button 
                onClick={() => { setViewType('farmers'); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${viewType === 'farmers' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
             >
                <Users className="w-5 h-5" /> Local Farmers
             </button>
           </div>
           
           <div className="relative flex-1">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder={viewType === 'crops' ? "Search for a specific harvest..." : "Search for a registered farmer..."} 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className={`w-full pl-16 pr-6 py-5 bg-white rounded-4xl border-2 border-transparent shadow-xl shadow-gray-200/40 font-bold outline-none transition-all ${viewType === 'crops' ? 'focus:border-green-600' : 'focus:border-green-600'}`}
             />
           </div>
        </div>

        {/* Listings Grid (Crops) */}
        {viewType === 'crops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {filteredProducts.map((product) => (
               <div key={product.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all overflow-hidden relative">
                  <div className="aspect-4/3 relative overflow-hidden">
                     <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black/80 to-transparent">
                        <h3 className="text-2xl font-black text-white">{product.name}</h3>
                        <p className="text-sm font-bold text-white/80 flex items-center gap-2">
                          <Users className="w-4 h-4" /> {product.seller}
                        </p>
                     </div>
                     <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {product.badges?.map((b, i) => (
                          <span key={i} className={`bg-white/90 backdrop-blur-md text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg ${b.toLowerCase().includes('verified') || b.toLowerCase().includes('brgy') ? 'text-blue-600' : 'text-green-600'}`}>
                             {b}
                          </span>
                        ))}
                     </div>
                  </div>
                  <div className="p-8">
                     <div className="flex justify-between items-end mb-8">
                        <div>
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Stock Level</p>
                           <p className="text-lg font-black text-gray-700">{product.stock} {product.unit}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Location</p>
                           <p className="text-sm font-bold text-gray-500 italic">{product.location}</p>
                        </div>
                     </div>
                     <button 
                      onClick={() => setSelectedEntity({ ...product, entityType: 'crop' })}
                      className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                     >
                       Certify Harvest <ShieldCheck className="w-5 h-5" />
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Farmers Grid */}
        {viewType === 'farmers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {filteredFarmers.map((farmer, idx) => (
               <div key={idx} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5 hover:shadow-2xl hover:shadow-green-900/10 transition-all overflow-hidden p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner group-hover:scale-110 transition-transform">
                       <UserCheck className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       {farmer.badges?.map((b, i) => (
                          <span key={i} className="text-[8px] font-black bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest">
                             {b}
                          </span>
                       ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-green-600 transition-colors uppercase tracking-tight">{farmer.name}</h3>
                    <p className="text-sm font-bold text-gray-400 italic">Farm located in {farmer.location}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Goods</p>
                        <p className="text-lg font-black text-gray-700">12 items</p>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Join Date</p>
                        <p className="text-lg font-black text-gray-700">6mo ago</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => setSelectedEntity({ ...farmer, entityType: 'farmer' })}
                    className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/10"
                  >
                    Certify Farmer <Award className="w-5 h-5" />
                  </button>
               </div>
             ))}
          </div>
        )}

        {/* Verification Modal */}
        <Modal 
          isOpen={!!selectedEntity} 
          onClose={() => setSelectedEntity(null)}
          title={`Certify ${selectedEntity?.name}`}
        >
          {showSuccess ? (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Trust Awarded!</h2>
              <p className="text-gray-500 font-medium">Certification successful for {selectedEntity?.name}</p>
            </div>
          ) : (
            <form onSubmit={handleAward} className="space-y-8">
             <div className={`${selectedEntity?.entityType === 'crop' ? 'bg-green-50 border-green-100' : 'bg-green-100/50 border-green-200'} p-6 rounded-[2rem] border flex items-start gap-4`}>
                 <ShieldAlert className="w-6 h-6 text-green-600 mt-1 shrink-0" />
                 <div>
                    <h4 className="font-black text-green-900 text-sm">Official Certification</h4>
                    <p className="text-xs text-green-700 font-medium leading-relaxed mt-1">
                      You are awarding a {selectedEntity?.entityType === 'farmer' ? 'professional certification' : 'quality indicator'} to <strong>{selectedEntity?.name}</strong>.
                      This will be published in the regional trust registry and visible to all buyers.
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Badge Type</label>
                <div className="grid grid-cols-2 gap-4">
                   {selectedEntity?.entityType === 'crop' ? (
                     <>
                        {[
                          { id: 'verified', label: 'Brgy. Verified', icon: ShieldCheck, desc: 'Location verified' },
                          { id: 'organic', label: 'Organic', icon: Leaf, desc: 'No pesticides' },
                          { id: 'top', label: 'Top Seller', icon: Star, desc: 'High volume' },
                          { id: 'direct', label: 'Direct Farm', icon: Package, desc: 'No middlemen' },
                        ].map((badge) => (
                          <label key={badge.id} className="relative group cursor-pointer">
                            <input type="radio" name="badgeType" className="peer hidden" defaultChecked={badge.id === 'verified'} />
                            <div className="p-5 border-2 border-gray-50 rounded-2xl group-hover:border-green-200 transition-all bg-white peer-checked:border-green-600 peer-checked:bg-green-50/40">
                               <badge.icon className="w-5 h-5 text-gray-400 mb-2 group-hover:text-green-500 peer-checked:text-green-600" />
                               <h5 className="font-black text-gray-900 text-xs">{badge.label}</h5>
                               <p className="text-[10px] text-gray-400 font-bold">{badge.desc}</p>
                            </div>
                          </label>
                        ))}
                     </>
                   ) : (
                     <>
                        {[
                          { id: 'trusted', label: 'Trusted Producer', icon: ShieldCheck, desc: 'Consistent delivery' },
                          { id: 'specialist', label: 'Organic Hub', icon: Leaf, desc: 'Eco-farming certified' },
                          { id: 'top_farmer', label: 'Premier Farmer', icon: Star, desc: 'Community leader' },
                          { id: 'verified_pro', label: 'Verified Pro', icon: UserCheck, desc: 'Identity confirmed' },
                        ].map((badge) => (
                          <label key={badge.id} className="relative group cursor-pointer">
                            <input type="radio" name="badgeType" className="peer hidden" defaultChecked={badge.id === 'trusted'} />
                            <div className="p-5 border-2 border-gray-50 rounded-2xl group-hover:border-green-200 transition-all bg-white peer-checked:border-green-600 peer-checked:bg-green-50/40">
                               <badge.icon className="w-5 h-5 text-gray-400 mb-2 group-hover:text-green-500 peer-checked:text-green-600" />
                               <h5 className="font-black text-gray-900 text-xs">{badge.label}</h5>
                               <p className="text-[10px] text-gray-400 font-bold">{badge.desc}</p>
                            </div>
                          </label>
                        ))}
                     </>
                   )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Audit Trail Justification</label>
                <textarea 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm h-32 focus:border-green-600"
                  placeholder="Record why this award is being issued..."
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedEntity(null)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BrgyAwardBadgePage;

