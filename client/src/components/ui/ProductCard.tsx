import React from 'react';
import { MapPin, Heart, ShoppingCart, Star, Package, Plus, User, ShieldCheck } from 'lucide-react';
import type { ProductCardProps } from '../../types';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '../../api/apiConfig';
import * as cartService from '../../services/cartService';
import { useToast } from './Toast';

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  viewMode = 'grid', 
  isFavorited = false, 
  onToggleFavorite 
}) => {
  const navigate = useNavigate();
  const { info, success } = useToast();
  const imageUrl = getFullImageUrl(product.image);

  const handleClick = () => {
    if (onClick) onClick();
    else navigate(`/buyer/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('agrilink_token');
    if (!token) {
      info('Sign in to continue.');
      navigate('/login');
      return;
    }
    cartService.addToCart(product, 1);
    success(`${product.name} added to cart`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(Number(product.id), e);
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleClick}
        className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-[#5ba409]/30 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row items-center p-5 gap-8">
          <div className="w-full sm:w-48 aspect-video rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50 relative group/img">
             {imageUrl.length > 5 ? (
               <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <Package size={32} />
               </div>
             )}
             <button
               onClick={handleFavoriteClick}
               className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                 isFavorited 
                 ? 'bg-red-50 text-red-500' 
                 : 'bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500'
               }`}
             >
               <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
             </button>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
             <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-green-50 text-[#5ba409] text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-100/50">{product.category}</span>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Stock: {product.stock} {product.unit}</p>
             </div>
             
             <div>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#5ba409] transition-colors truncate tracking-tight">{product.name}</h3>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <ShieldCheck size={12} className="text-[#5ba409]" /> {product.seller}
                   </div>
                   <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-black text-gray-900">{(product as any).avgRating || '5.0'}</span>
                      <span className="text-[10px] font-bold text-gray-300">({(product as any).reviewCount || 0})</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-5 sm:border-l sm:border-gray-50 sm:pl-10 sm:py-2">
             <div className="text-right">
                <div className="flex items-baseline gap-1 text-gray-900">
                   <span className="text-sm font-bold opacity-30">₱</span>
                   <span className="text-3xl font-black tracking-tighter">{product.price.toLocaleString()}</span>
                   <span className="text-[11px] font-bold text-gray-400 italic">/ {product.unit}</span>
                </div>
             </div>
             <button 
               onClick={handleAddToCart}
               className="h-12 px-10 bg-[#5ba409] text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-green-900/10 active:scale-95"
             >
                <Plus size={18} /> Add to Cart
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 group hover:border-[#5ba409]/20 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer flex flex-col h-full relative"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-50 border-b border-gray-50/50">
        <img
          src={imageUrl.length > 5 ? imageUrl : undefined}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {(imageUrl.length <= 5) && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-200">
             <Package size={32} />
          </div>
        )}

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xl shadow-black/5 z-10 ${
            isFavorited 
            ? 'bg-white text-red-500 scale-110' 
            : 'bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
          }`}
        >
          <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
        </button>

        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-1.5 text-gray-900 shadow-sm">
            <MapPin size={10} className="text-[#5ba409]" />
            <span className="text-[10px] font-black tracking-tight uppercase tracking-[0.1em] leading-none">{product.location}</span>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
             <span className="text-[9px] font-black text-[#5ba409] uppercase tracking-[0.2em] px-2.5 py-1 bg-green-50 rounded-lg border border-green-100/30">
               {product.category}
             </span>
             {/* 🎖️ Seller Global Rating (Star Display) */}
             <div className="flex items-center gap-1">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-black text-gray-900">{(product as any).avgRating || '5.0'}</span>
                <span className="text-[10px] font-bold text-gray-400 ml-0.5">({(product as any).reviewCount || 0})</span>
             </div>
          </div>
          
          <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-[#5ba409] transition-colors truncate tracking-tight mb-2">
            {product.name}
          </h3>
          
          <div className="flex flex-col gap-1.5 pt-1">
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                <ShieldCheck size={12} className="text-[#5ba409]" /> {product.seller}
             </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Price / {product.unit}</span>
            <div className="flex items-baseline gap-0.5 text-gray-900">
              <span className="text-xs font-bold opacity-30">₱</span>
              <span className="text-[26px] font-black tracking-tighter leading-none">{product.price.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-12 h-12 bg-[#5ba409] text-white rounded-2xl flex items-center justify-center hover:bg-green-700 transition-all duration-300 shadow-xl shadow-green-900/10 active:scale-95 group/btn overflow-hidden relative"
          >
            <Plus size={22} className="z-10" />
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
