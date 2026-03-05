import React from 'react';
import {
    X, MapPin, Star, ShieldCheck, Zap,
    ShoppingCart, MessageSquare, Truck, Leaf,
    Package, Clock, CheckCircle, Lock
} from 'lucide-react';
import Modal from './Modal';
import { API_BASE_URL } from '../../api/apiConfig';

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product }) => {
    if (!product) return null;

    // Normalize data between different table/card formats
    const id = product.p_id || product.id;
    const name = product.p_name || product.name;
    const price = product.p_price || product.price;
    const quantity = product.p_quantity || product.stock;
    const unit = product.p_unit || product.unit;
    const category = product.cat_name || product.category || 'Agri Product';
    const seller = product.first_name ? `${product.first_name} ${product.last_name}` : (product.seller || 'Verified Farmer');
    const image = product.p_image || product.image;
    const ownerId = product.u_id || product.user_id;

    const currentUserId = localStorage.getItem('agrilink_id');
    const isOwner = currentUserId && ownerId && currentUserId.toString() === ownerId.toString();

    const resolveImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const baseUrl = API_BASE_URL.replace('/api', '');
        return `${baseUrl}${path}`;
    };

    const imageUrl = resolveImageUrl(image);
    const isLowStock = parseFloat(quantity) < 15;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-[#5ba409]" />
                    <span>Product Overview</span>
                </div>
            }
            maxWidth="max-w-4xl"
        >
            <div className="relative space-y-8 overflow-hidden">
                {/* 🌿 Decorative Background Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#5ba409]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-[#4d8f08]/5 rounded-full blur-3xl pointer-events-none" />

                <Leaf className="absolute top-10 right-10 w-24 h-24 text-[#5ba409]/5 -rotate-12 pointer-events-none" />
                <Leaf className="absolute bottom-40 left-10 w-16 h-16 text-[#4d8f08]/5 rotate-45 pointer-events-none" />

                <div className="grid md:grid-cols-2 gap-10 items-start">
                    {/* 🖼️ Product Imagery */}
                    <div className="relative group">
                        <div className="relative rounded-[2rem] overflow-hidden bg-slate-50 border border-gray-100 shadow-inner h-[400px]">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-200">
                                    <Package className="w-20 h-20 mb-4 opacity-20" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">No Visual Data</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                            {/* Floating Status Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {isLowStock && (
                                    <div className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 animate-pulse">
                                        <Zap className="w-3 h-3 fill-current" /> Critical Stock
                                    </div>
                                )}
                                <div className="bg-white/90 backdrop-blur-md text-[#5ba409] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-green-50 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" /> QA Verified
                                </div>
                            </div>

                            {/* Location Badge */}
                            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-white shadow-2xl">
                                    <MapPin className="w-4 h-4 text-green-400" />
                                    <span className="text-xs font-black tracking-tight uppercase italic">{product.location || 'Local Farm'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 📝 Product Specification */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-green-50 text-[#5ba409] text-[10px] font-black rounded-lg uppercase tracking-widest border border-green-100 italic">
                                    {category}
                                </span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Inventory ID: {id?.toString().padStart(6, '0')}</span>
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                                {name}
                            </h2>
                            <div className="flex items-center gap-4 py-4 border-y border-gray-50">
                                <div className="flex items-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">4.9 Overall Performance</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100/50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2 leading-none">Market Unit Price</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-gray-900 italic">₱{price}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase italic">/ {unit}</span>
                                </div>
                            </div>
                            <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100/50">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2 leading-none">In-Stock Reserve</p>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-2xl font-black italic ${isLowStock ? 'text-amber-600' : 'text-[#5ba409]'}`}>{quantity}</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase italic">{unit} Total</span>
                                </div>
                            </div>
                        </div>

                        {/* Seller Information */}
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 flex items-center gap-4 group cursor-pointer hover:border-green-100 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
                                {seller.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-1">Authenticated Seller</p>
                                <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none italic">
                                    {isOwner ? `You (${seller})` : seller}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-green-600 uppercase italic tracking-wider leading-none">Platform Verified</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-[#5ba409] group-hover:bg-green-50 transition-all">
                                {!isOwner && <MessageSquare className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🎯 Centered Elite Actions */}
                {!isOwner && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-gray-50 max-w-2xl mx-auto">
                        <button className="w-full sm:w-auto px-12 py-5 bg-gradient-to-br from-[#5ba409] to-[#4d8f08] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] italic text-[12px] shadow-2xl shadow-green-900/20 hover:shadow-green-500/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4 group">
                            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Secure Acquisition
                        </button>
                        <button className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-slate-100 hover:border-[#5ba409] text-gray-400 hover:text-[#5ba409] rounded-[2rem] font-black uppercase tracking-[0.3em] italic text-[12px] transition-all active:scale-95 flex items-center justify-center gap-4 group">
                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Negotiate
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ProductDetailModal;
