import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Star, 
  MapPin, 
  Truck, 
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';
import { sampleProducts } from '../../data';
import ProductCard from '../ui/ProductCard';

const MarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(200);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { name: 'All', icon: Zap },
    { name: 'Vegetables', icon: Leaf },
    { name: 'Fruits', icon: Star },
    { name: 'Grains', icon: ShieldCheck },
    { name: 'Poultry', icon: Truck }
  ];

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* 🚀 Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-[#1B5E20] to-[#5ba409] flex items-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="flex items-center gap-2 text-white/80 font-black text-xs uppercase tracking-[0.3em] mb-4 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
              <Leaf className="w-4 h-4 text-green-300" /> Direct from Local Farms
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[0.9]">
              Eat Fresh, <br />
              <span className="text-green-300">Support Local.</span>
            </h1>
            <p className="text-xl text-green-50/80 mb-8 font-medium max-w-lg">
              Unlock the freshest produce harvesting right now in your community. Direct from farmer to your table.
            </p>
            
            <div className="relative max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5ba409] transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="What are you craving today?..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-5 bg-white rounded-3xl shadow-2xl text-lg font-bold outline-none ring-4 ring-transparent focus:ring-green-400/20 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 🏷️ Horizontal Category Strip */}
        <div className="flex items-center gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-[#5ba409] text-white shadow-xl shadow-green-500/30 -translate-y-1'
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-green-200 hover:text-[#5ba409] hover:bg-green-50/30'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* 🔍 Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-10 order-2 lg:order-1">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
              <div className="flex items-center gap-3 mb-8">
                <Filter className="w-5 h-5 text-[#5ba409]" />
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Refine Search</h3>
              </div>

              {/* Price Filter */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Max Price</label>
                  <span className="text-[#5ba409] font-black text-lg font-mono">₱{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#5ba409]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-black">
                   <span>₱20</span>
                   <span>₱500</span>
                </div>
              </div>

              {/* Status Filters */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Product Type</p>
                  {[
                    { label: 'Brgy. Verified', count: 42 },
                    { label: 'Organic Certified', count: 18 },
                    { label: 'Top Rated', count: 25 },
                  ].map((filter) => (
                   <label key={filter.label} className="flex items-center justify-between group cursor-pointer hover:text-[#5ba409] transition-colors">
                     <div className="flex items-center gap-3">
                       <input type="checkbox" className="w-5 h-5 rounded border-2 border-gray-200 text-[#5ba409] focus:ring-[#5ba409] accent-[#5ba409]" />
                       <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{filter.label}</span>
                     </div>
                     <span className="text-[10px] bg-gray-50 px-2 py-1 rounded-md text-gray-400 font-bold">{filter.count}</span>
                   </label>
                 ))}
              </div>
            </div>

            {/* Support/Promo Widget */}
            <div className="bg-[#1B5E20] p-8 rounded-[2rem] text-white relative overflow-hidden group">
               <div className="relative z-10">
                 <h4 className="text-lg font-black mb-2">Farmer Support 🤝</h4>
                 <p className="text-sm text-green-100/70 mb-6 leading-relaxed">100% of the revenue goes directly to your chosen local farmer.</p>
                 <button className="text-xs font-black uppercase tracking-widest underline decoration-green-400 underline-offset-4 decoration-2">Learn our mission</button>
               </div>
               <Leaf className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
            </div>
          </aside>

          {/* 🛒 Main Product Area */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  Browse {selectedCategory === 'All' ? 'Our Marketplace' : selectedCategory}
                </p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  {filteredProducts.length} <span className="text-[#5ba409]">Results</span> Found
                </h2>
              </div>

              <div className="flex items-center gap-4">
                 <div className="hidden md:flex items-center bg-gray-100 p-1.5 rounded-2xl">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#5ba409]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#5ba409]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="relative group">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-100 rounded-2xl pl-6 pr-12 py-4 font-black text-sm text-gray-600 cursor-pointer shadow-xl shadow-gray-200/20 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all"
                    >
                      <option value="featured">Featured First</option>
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-900 transition-colors" />
                 </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">No products found</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  Try adjusting your filters or search term to discover other fresh produce.
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setPriceRange(200);
                    setSelectedCategory('All');
                  }}
                  className="mt-8 px-10 py-4 bg-[#5ba409] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/30 hover:-translate-y-1 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
