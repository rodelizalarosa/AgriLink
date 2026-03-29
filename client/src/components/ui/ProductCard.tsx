import React from 'react';
import { ShoppingCart, User, MapPin, Star, Heart, Zap, ShieldCheck, Leaf } from 'lucide-react';
import type { ProductCardProps } from '../../types';

import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api/apiConfig';

import * as cartService from '../../services/cartService';

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const navigate = useNavigate();
  const serverBase = API_BASE_URL.replace('/api', '');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartService.addToCart(product, 1);
    // Optional: Add a small toast or visual feedback here
    alert(`${product.name} added to cart!`);
  };

  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return '🌱';
    if (imagePath.startsWith('http') || imagePath.length < 5) return imagePath;
    return `${serverBase}${imagePath}`;
  };

  const imageUrl = getFullImageUrl(product.image);

  const handleClick = () => {
    if (onClick) onClick();
    else navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 hover:shadow-green-900/10 transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-green-100 transform hover:-translate-y-2 relative cursor-pointer"
    >
      {/* 🌿 Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-green-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-green-600/10 transition-colors" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-24 h-24 bg-green-700/5 rounded-full blur-2xl pointer-events-none group-hover:bg-green-700/10 transition-colors" />

      {/* Floating Leaves */}
      <Leaf className="absolute top-1/2 left-4 w-4 h-4 text-green-600/10 -rotate-12 pointer-events-none group-hover:text-green-600/20 transition-all duration-700 delay-100 group-hover:translate-y-[-20px] group-hover:rotate-12" />
      <Leaf className="absolute bottom-1/4 right-4 w-6 h-6 text-green-600/5 rotate-45 pointer-events-none group-hover:text-green-600/15 transition-all duration-700 group-hover:translate-y-[-10px] group-hover:-rotate-12" />
      {/* 🖼️ Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent z-10"></div>

        {/* Floating Badges */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          {product.stock < 15 && (
            <div className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse">
              <Zap className="w-3 h-3 fill-current" /> Low Stock
            </div>
          )}
          {product.badges && product.badges.map((badge, idx) => (
            <div key={idx} className="bg-white/90 backdrop-blur-md text-green-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-green-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> {badge}
            </div>
          ))}
          {!product.badges && (
            <div className="bg-white/90 backdrop-blur-md text-green-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-green-100 flex items-center gap-1.5">
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

        {imageUrl.length > 5 ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl transform group-hover:scale-110 transition-transform duration-700">
            {imageUrl}
          </div>
        )}

        {/* Status Overlay */}
        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 text-white shadow-2xl">
            <MapPin className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-black tracking-tight">{product.location}</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-2xl flex items-center gap-1 shadow-2xl">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">{product.stock} {product.unit} left</span>
          </div>
        </div>
      </div>

      {/* 📝 Content */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="flex items-center gap-2 text-[10px] font-black text-green-600 bg-green-50/50 px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 border border-green-100/50 italic backdrop-blur-sm">
              <Leaf className="w-3 h-3" />
              {product.category}
            </span>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-green-600 transition-colors">{product.name}</h3>
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

        <div className="flex items-center justify-between pt-6 border-t border-gray-100/50 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price per</span>
              <span className="px-2 py-0.5 bg-green-50 text-[#5ba409] text-[9px] font-black rounded-md uppercase tracking-wider border border-green-100">
                {product.unit}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="text-xl font-bold text-gray-400 mt-1">₱</span>
              <span className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none">{product.price}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="relative w-14 h-14 bg-linear-to-br from-green-600 to-[#3d6e06] hover:from-[#1B5E20] hover:to-[#0a2e10] text-white rounded-2xl shadow-[0_10px_20px_-5px_rgba(91,164,9,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(27,94,32,0.5)] flex items-center justify-center transition-all duration-300 active:scale-90 group/btn overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
            <ShoppingCart className="w-6 h-6 transform group-hover/btn:scale-110 group-hover/btn:-rotate-12 transition-all duration-300" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
