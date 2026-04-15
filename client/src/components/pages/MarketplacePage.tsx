import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Heart,
  Package,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  User,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';
import { API_BASE_URL } from '../../api/apiConfig';
import type { Product } from '../../types';
import { useToast } from '../ui/Toast';

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { info, error, success } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const token = localStorage.getItem('agrilink_token');

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.favorites) {
          const ids = data.favorites.map((f: any) => f.p_id || f.product_id);
          setFavoriteIds(ids);
        }
      }
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
    const handleFocus = () => fetchFavorites();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [token]);

  const handleToggleFavorite = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      info('Sign in to save harvests.');
      navigate('/login');
      return;
    }
    const isFav = favoriteIds.includes(productId);
    const previousFavorites = [...favoriteIds];
    if (isFav) setFavoriteIds(prev => prev.filter(id => id !== productId));
    else setFavoriteIds(prev => [...prev, productId]);

    try {
      const method = isFav ? 'DELETE' : 'POST';
      const url = isFav ? `${API_BASE_URL}/favorites/${productId}` : `${API_BASE_URL}/favorites`;
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: isFav ? undefined : JSON.stringify({ productId })
      });
      if (!res.ok) {
        setFavoriteIds(previousFavorites);
        error('Action failed.');
      } else {
        if (isFav) success('Harvest unsaved.');
        else success('Harvest saved!');
      }
    } catch (err) {
      setFavoriteIds(previousFavorites);
      error('Network error.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (data.products) {
          const mappedProducts: Product[] = data.products.map((p: any) => ({
            id: p.p_id,
            name: p.p_name,
            price: parseFloat(p.p_price),
            unit: p.p_unit,
            seller: `${p.first_name} ${p.last_name}`,
            location: p.city || 'Local Farm',
            stock: parseFloat(p.p_quantity),
            image: p.p_image || '',
            category: p.cat_name || 'Others',
            badges: [],
            avgRating: parseFloat(p.sellerAvgRating) || 5.0,
            reviewCount: parseInt(p.sellerReviewCount) || 0,
            sellerUserId: Number(p.u_id)
          }));
          setProducts(mappedProducts);
        }
      } catch (err) {
        setFetchError('Currently unable to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesFavorite = !showFavoritesOnly || favoriteIds.includes(Number(product.id));
      return matchesSearch && matchesCategory && matchesPrice && matchesFavorite;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return (b as any).avgRating - (a as any).avgRating;
    });
  }, [products, searchTerm, selectedCategory, minPrice, maxPrice, showFavoritesOnly, favoriteIds, sortBy]);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Root Crops', 'Others'];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      
      {/* 🏙️ Clean & Neat SaaS Marketplace Header */}
      <div className="bg-white border-b border-gray-100 py-8 lg:py-10">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center text-[#5ba409]">
                  <Sparkles size={12} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5ba409]">Digital Agriculture Marketplace</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
              Marketplace<span className="text-[#5ba409]">.</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Connecting buyers directly to farmers</p>
          </div>
          <div className="flex-1 max-w-xl w-full relative group">
            <div className="relative">
              <input
                type="text"
                placeholder="Search harvests, farmers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-[#5ba409]/20 transition-all outline-none placeholder:text-gray-300"
              />
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-300 group-focus-within:text-[#5ba409] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Functional Sticky Bar - Layout Fixed */}
      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-50 py-3.5">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5ba409]" />
              <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">
                Active Listings: <span className="text-[#5ba409]">{filteredProducts.length}</span>
              </p>
           </div>
           
           <div className="flex items-center gap-6">
              {/* 🛠️ Improved Layout Toggle (SaaS Style) */}
              <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100 shrink-0">
                 <button 
                  onClick={() => setViewMode('grid')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                    <LayoutGrid size={12} /> Grid
                 </button>
                 <button 
                  onClick={() => setViewMode('list')} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                    <List size={12} /> List
                 </button>
              </div>

              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Sort:</span>
                 <div className="relative group">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-transparent text-[11px] font-black text-gray-900 uppercase tracking-widest outline-none cursor-pointer pr-4"
                    >
                      <option value="featured">Featured</option>
                      <option value="rating">Top Rated</option>
                      <option value="price-low">Economic</option>
                      <option value="price-high">Premium</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 pointer-events-none" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-10 flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-56 shrink-0">
           <div className="sticky top-[140px] space-y-8">
              <div className="space-y-3">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Collections</h3>
                 <div className="flex flex-col gap-0.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          selectedCategory === cat 
                          ? 'bg-[#5ba409] text-white shadow-lg shadow-green-900/10' 
                          : 'text-gray-500 hover:bg-green-50/50 hover:text-[#5ba409]'
                        }`}
                      >
                        {cat}
                        {selectedCategory === cat && <ChevronRight size={12} className="opacity-60" />}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100 space-y-3">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Economics</h3>
                 <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-xl text-[11px] font-black focus:bg-white focus:border-green-100 transition-all outline-none" 
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice === 1000000 ? '' : maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value) || 1000000)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-xl text-[11px] font-black focus:bg-white focus:border-green-100 transition-all outline-none" 
                    />
                 </div>
              </div>

              {token && (
                <div className="pt-8 border-t border-gray-100">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`w-full p-1 rounded-[1.5rem] flex items-center transition-all group ${
                      showFavoritesOnly 
                      ? 'bg-[#5ba409] text-white shadow-xl shadow-green-900/20' 
                      : 'bg-white border border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-900'
                    }`}
                  >
                     <div className={`p-3 rounded-2xl transition-all ${showFavoritesOnly ? 'bg-white/20' : 'bg-gray-50 text-[#5ba409]'}`}>
                        <Heart size={16} className={showFavoritesOnly ? 'fill-current' : ''} />
                     </div>
                     <div className="flex-1 px-3 text-left">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${showFavoritesOnly ? 'text-white' : 'text-gray-900'}`}>Saved Items</p>
                        <p className={`text-[9px] font-bold ${showFavoritesOnly ? 'text-white/60' : 'text-gray-400'}`}>Source Later</p>
                     </div>
                     <div className={`mr-2 px-3 py-1 rounded-full text-[11px] font-black ${showFavoritesOnly ? 'bg-white text-[#5ba409]' : 'bg-[#5ba409] text-white'}`}>
                        {favoriteIds.length}
                     </div>
                  </button>
                </div>
              )}
           </div>
        </aside>

        <main className="flex-1 min-w-0">
           {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="bg-gray-50 animate-pulse rounded-2xl aspect-[16/9]" />
               ))}
             </div>
           ) : (
             <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-5 animate-in fade-in duration-500`}>
               {filteredProducts.map((p) => (
                 <ProductCard
                   key={p.id}
                   product={p}
                   viewMode={viewMode}
                   isFavorited={favoriteIds.includes(Number(p.id))}
                   onToggleFavorite={handleToggleFavorite}
                   onClick={() => navigate(`/buyer/product/${p.id}`)}
                 />
               ))}
             </div>
           )}

           {!loading && filteredProducts.length === 0 && (
             <div className="py-24 text-center bg-gray-50/50 border border-gray-100 rounded-[2rem]">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-50">
                   <Package size={24} className="text-gray-100" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Zero Harvests matches</h3>
                <button
                  onClick={() => { setSearchTerm(''); setMinPrice(0); setMaxPrice(1000000); setSelectedCategory('All'); setShowFavoritesOnly(false); }}
                  className="mt-8 px-8 py-3 bg-[#5ba409] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-green-900/10 hover:bg-green-700 transition-all"
                >
                  Reset Marketplace
                </button>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default MarketplacePage;
