import React from 'react';
import { ShoppingCart, User, MapPin } from 'lucide-react';
import type { ProductCardProps } from '../../types';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-transparent hover:border-[#5ba409] transform hover:-translate-y-1">
      <div className="relative bg-gradient-to-br from-[#F9FBE7] to-[#E8F5E9] h-48 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRDQUY1MCIgb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        {product.image.includes('/') || product.image.includes('.jpg') || product.image.includes('.png') ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
            {product.image}
          </span>
        )}
        {product.stock < 20 && (
          <div className="absolute top-3 right-3 bg-[#FFC107] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Low Stock
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <User className="w-4 h-4 mr-1 text-[#8D6E63]" />
          <span className="font-medium">{product.seller}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1 text-[#5ba409]" />
          <span>{product.location}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
          <div>
            <span className="text-2xl font-bold text-[#5ba409]">₱{product.price}</span>
            <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
          </div>
          <button className="bg-[#5ba409] hover:bg-[#4d8f08] text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-1">
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-semibold text-[#5ba409]">{product.stock} {product.unit}</span> available
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
