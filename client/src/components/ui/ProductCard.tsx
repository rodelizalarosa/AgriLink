import React from 'react';
import { ShoppingCart, User, MapPin, Star, Heart, Zap, ShieldCheck } from 'lucide-react';
import type { ProductCardProps } from '../../types';

import { useNavigate } from 'react-router-dom';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 hover:shadow-green-900/10 transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-green-100 transform hover:-translate-y-2 relative cursor-pointer"
    >
      {/* 🖼️ Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        
        {/* Floating Badges */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
           {product.stock < 15 && (
             <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse">
               <Zap className="w-3 h-3 fill-current" /> Low Stock
             </div>
           )}
           {product.badges && product.badges.map((badge, idx) => (
             <div key={idx} className="bg-white/90 backdrop-blur-md text-[#5ba409] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-green-100 flex items-center gap-1.5">
               <ShieldCheck className="w-3 h-3" /> {badge}
             </div>
           ))}
           {!product.badges && (
             <div className="bg-white/90 backdrop-blur-md text-[#5ba409] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-green-100 flex items-center gap-1.5">
               <ShieldCheck className="w-3 h-3" /> Community Verified
             </div>
           )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Handle wishlist logic here later
          }}
          className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-lg active:scale-95"
        >
           <Heart className="w-5 h-5" />
        </button>

        {product.image.includes('/') || product.image.includes('.jpg') || product.image.includes('.png') ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl transform group-hover:scale-110 transition-transform duration-700">
            {product.image}
          </div>
        )}

        {/* Location Overlay */}
        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-white shadow-2xl">
              <MapPin className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-black tracking-tight">{product.location}</span>
            </div>
            <div className="bg-white px-3 py-2 rounded-2xl flex items-center gap-1 shadow-2xl">
               <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
               <span className="text-xs font-black text-gray-900">4.9</span>
            </div>
        </div>
      </div>

      {/* 📝 Content */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
           <div>
             <span className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 block w-fit border border-green-100">
               {product.category}
             </span>
             <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#5ba409] transition-colors">{product.name}</h3>
           </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-black text-xs">
              {product.seller.charAt(0)}
           </div>
           <div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Produced by</p>
             <p className="text-sm font-bold text-gray-800 tracking-tight">{product.seller}</p>
           </div>
        </div>

        <div className="flex items-end justify-between pt-6 border-t border-gray-50 mt-auto">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price per {product.unit}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900 tracking-tighter">₱{product.price}</span>
            </div>
          </div>
          
          <button 
             onClick={(e) => {
               e.stopPropagation();
               // Handle add to cart logic here later
             }}
             className="w-14 h-14 bg-[#5ba409] hover:bg-[#1B5E20] text-white rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-green-900/40 flex items-center justify-center transition-all active:scale-95 group/btn overflow-hidden relative"
          >
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
             <ShoppingCart className="w-6 h-6 relative z-10" />
          </button>
        </div>

        {/* Progress Display */}
        <div className="mt-6 flex items-center justify-between gap-4">
           <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${product.stock < 15 ? 'bg-amber-400' : 'bg-green-400'}`}
                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
              ></div>
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
             {product.stock} {product.unit} left
           </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
