import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  ShieldCheck,
  MapPin,
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  Truck,
  Leaf,
  Clock,
  Package,
  User,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { sampleProducts } from '../../../data';
import type { Product } from '../../../types';

const MOCK_REVIEWS = [
  { name: 'Maria S.',    avatar: 'MS', rating: 5, date: 'Feb 28, 2026', text: 'Super fresh! Delivered ahead of schedule. Will order again next week.' },
  { name: 'Pedro R.',   avatar: 'PR', rating: 5, date: 'Feb 26, 2026', text: 'Best quality produce I have found in AgriLink. The tomatoes were perfectly ripe.' },
  { name: 'Ana G.',     avatar: 'AG', rating: 4, date: 'Feb 24, 2026', text: 'Good quantity for the price. Packaging could be improved but the product itself is excellent.' },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product: Product | undefined = sampleProducts.find(p => p.id === Number(id));

  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'seller'>('details');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FBE7] gap-6">
        <div className="text-7xl">🌾</div>
        <h2 className="text-3xl font-black text-gray-900">Product not found</h2>
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-2xl font-black"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Marketplace
        </button>
      </div>
    );
  }

  const total = product.price * qty;
  const isLowStock = product.stock < 15;

  const handleOrder = () => {
    navigate(`/checkout/${product.id}?qty=${qty}`);
  };

  const handleCart = () => {
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2500);
  };

  const related = sampleProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9FBE7]">

      {/* ── Top Nav Strip ─────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-black text-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Marketplace
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <span>Marketplace</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900">{product.name}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setWishlisted(w => !w)}
              className={`p-3 rounded-2xl border transition-all font-black ${wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-red-400'}`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-gray-700 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* ── Hero Section ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Left — Image */}
          <div className="space-y-4 sticky top-28">
            <div className="relative rounded-[3rem] overflow-hidden h-[500px] bg-white shadow-2xl shadow-green-900/10 border border-gray-100 group">
              {/* Badges */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {isLowStock && (
                  <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <Zap className="w-3 h-3 fill-current" /> Only {product.stock} left
                  </div>
                )}
                {product.badges?.map((badge, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur-md text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-green-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" /> {badge}
                  </div>
                ))}
              </div>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Bottom overlay */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-white border border-white/10">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-black">{product.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl shadow-lg">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-gray-900">4.9</span>
                  <span className="text-xs text-gray-400 font-bold">(48)</span>
                </div>
              </div>
            </div>

            {/* Thumbnail strip — repeated product image for demo */}
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-20 flex-1 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${i === 0 ? 'border-green-500' : 'border-transparent hover:border-green-200'}`}>
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div className="space-y-8">
            {/* Category + Name */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-green-100">
                  {product.category}
                </span>
                {product.badges?.map((b, i) => (
                  <span key={i} className="text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-purple-100 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> {b}
                  </span>
                ))}
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">{product.name}</h1>
              <p className="text-gray-400 font-bold mt-2 italic">Farm-fresh, direct from {product.location}</p>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-500">4.9 · 48 reviews · 120+ orders</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900 tracking-tighter">₱{product.price}</span>
              <span className="text-xl font-bold text-gray-400">/ {product.unit}</span>
            </div>

            {/* Stock bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                <span>Stock availability</span>
                <span className={isLowStock ? 'text-amber-600' : 'text-green-600'}>{product.stock} {product.unit} left</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${isLowStock ? 'bg-amber-400' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* Farmer chip */}
            <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 font-black text-xl">
                {product.seller.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Sold by</p>
                <div 
                  className="flex items-center gap-2 group/seller cursor-pointer w-fit"
                  onClick={() => navigate(`/profile/farmer-${product.seller.replace(/\s+/g, '-').toLowerCase()}`)}
                >
                  <p className="text-lg font-black text-gray-900 group-hover/seller:text-green-600 transition-colors">{product.seller}</p>
                  <ExternalLink className="w-4 h-4 text-gray-300 group-hover/seller:text-green-500 transition-colors" />
                </div>
                <p className="text-xs font-bold text-green-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified Farmer · 98% positive reviews
                </p>
              </div>
              <button
                onClick={() => navigate('/messages')}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-green-50 rounded-2xl font-black text-xs text-gray-500 hover:text-green-600 border border-gray-100 hover:border-green-200 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Chat
              </button>
            </div>

            {/* Quantity picker */}
            <div className="space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Quantity ({product.unit})</p>
              <div className="flex items-center gap-5">
                <div className="flex items-center bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/30">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-5 py-4 text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all font-black text-xl"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-8 text-2xl font-black text-gray-900 min-w-[80px] text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="px-5 py-4 text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all font-black text-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-green-50 border border-green-100 px-6 py-4 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</p>
                  <p className="text-2xl font-black text-green-700 tracking-tighter">₱{total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleOrder}
                className="flex-[2] py-6 border-2 border-green-600 bg-green-600 hover:bg-transparent text-white hover:text-green-600 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-green-600/20 hover:shadow-none hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {orderSuccess ? <><CheckCircle className="w-6 h-6" /> Order Placed!</> : <><CheckCircle className="w-6 h-6" /> Place Order</>}
              </button>
              <button
                onClick={handleCart}
                className="flex-1 py-6 border-2 border-green-600 bg-transparent text-green-600 hover:bg-green-600 hover:text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all hover:shadow-2xl hover:shadow-green-600/20 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                {cartSuccess ? <><CheckCircle className="w-6 h-6" /> Added!</> : <><ShoppingCart className="w-6 h-6" /> Add to Cart</>}
              </button>
            </div>

            {/* Trust chips */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Same-day Delivery', sub: 'Order by 2PM' },
                { icon: Leaf,  label: 'Freshness Guaranteed', sub: '100% farm-fresh' },
                { icon: ShieldCheck, label: 'Brgy. Verified', sub: 'Trust certified' },
              ].map((pill, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                  <pill.icon className="w-5 h-5 text-green-500 mx-auto mb-1.5" />
                  <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{pill.label}</p>
                  <p className="text-[9px] text-gray-400 font-bold mt-0.5">{pill.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Detail Tabs ────────────────────────────────────────── */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/30 border border-gray-100 overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-100">
            {(['details', 'reviews', 'seller'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-6 font-black text-sm uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-green-600 text-green-600 bg-green-50/40'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab === 'details' ? 'Product Details' : tab === 'reviews' ? `Reviews (${MOCK_REVIEWS.length})` : 'About the Seller'}
              </button>
            ))}
          </div>

          <div className="p-10 lg:p-14">

            {/* --- Details Tab --- */}
            {activeTab === 'details' && (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">About this Product</h2>
                  <p className="text-gray-500 font-medium leading-relaxed text-lg">
                    {product.name} sourced fresh from {product.location}. Carefully hand-picked at peak ripeness to ensure maximum freshness and flavor when it arrives at your door. No preservatives, no cold-storage delays — direct from the farm.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Category',    value: product.category },
                      { label: 'Unit',        value: product.unit },
                      { label: 'Price / unit',value: `₱${product.price}` },
                      { label: 'Stock',       value: `${product.stock} ${product.unit}` },
                      { label: 'Location',    value: product.location },
                      { label: 'Harvest Date',value: 'Feb 28, 2026' },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="font-black text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Information</h2>
                  {[
                    { icon: Truck,   title: 'Standard Delivery',   desc: '2–4 hours within 25km radius. ₱50 flat fee.' },
                    { icon: Zap,     title: 'Express Delivery',    desc: 'Order before 12PM for 1-hour delivery. ₱90 fee.' },
                    { icon: Package, title: 'Pick-up Available',   desc: 'Free self-pickup at barangay drop-off point.' },
                    { icon: Clock,   title: 'Delivery Window',     desc: 'Mon–Sat, 7AM – 6PM. Sunday on request.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-400 font-medium mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Reviews Tab --- */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-8 pb-8 border-b border-gray-100">
                  <div className="text-center shrink-0">
                    <p className="text-7xl font-black text-gray-900 tracking-tighter">4.9</p>
                    <div className="flex justify-center gap-1 mt-2 mb-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-sm font-bold text-gray-400">Based on 48 reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs font-black text-gray-400 w-4">{star}</span>
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '3%' }} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 w-6">{star === 5 ? 38 : star === 4 ? 7 : star === 3 ? 2 : 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  {MOCK_REVIEWS.map((rev, i) => (
                    <div key={i} className="flex gap-5 p-6 bg-gray-50/50 rounded-3xl">
                      <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 font-black flex items-center justify-center text-sm shrink-0">
                        {rev.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-black text-gray-900">{rev.name}</span>
                            <span className="text-xs text-gray-400 font-bold ml-3">{rev.date}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(rev.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                          </div>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed">{rev.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Seller Tab --- */}
            {activeTab === 'seller' && (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-orange-50 border-4 border-orange-100 flex items-center justify-center text-orange-500 font-black text-4xl shadow-xl cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate(`/profile/farmer-${product.seller.replace(/\s+/g, '-').toLowerCase()}`)}>
                      {product.seller.charAt(0)}
                    </div>
                    <div>
                      <h2 
                        className="text-3xl font-black text-gray-900 tracking-tight cursor-pointer hover:text-green-600 flex items-center gap-2 transition-colors group"
                        onClick={() => navigate(`/profile/farmer-${product.seller.replace(/\s+/g, '-').toLowerCase()}`)}
                      >
                        {product.seller}
                        <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h2>
                      <p className="text-green-600 font-bold flex items-center gap-1.5 mt-1">
                        <BadgeCheck className="w-4 h-4" /> Verified Farmer
                      </p>
                      <p className="text-sm text-gray-400 font-medium mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {product.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    A dedicated local farmer from {product.location} with over 5 years of experience growing {product.category.toLowerCase()}. Certified by the local Barangay trust program and known for consistent quality and timely deliveries.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Products',    value: '12' },
                      { label: 'Orders',      value: '340+' },
                      { label: 'Rating',      value: '4.9★' },
                    ].map((s, i) => (
                      <div key={i} className="bg-gray-50 p-5 rounded-2xl text-center">
                        <p className="text-2xl font-black text-gray-900">{s.value}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/messages')}
                    className="w-full py-5 bg-gray-900 hover:bg-green-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl"
                  >
                    <MessageSquare className="w-5 h-5" /> Message {product.seller}
                  </button>
                </div>
                <div className="space-y-4">
                  <h3 className="font-black text-gray-900 text-xl">More from this Seller</h3>
                  {sampleProducts.filter(p => p.seller === product.seller && p.id !== product.id).slice(0, 2).map(p => (
                    <button key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="w-full flex items-center gap-5 p-5 bg-gray-50 hover:bg-green-50 rounded-2xl border border-gray-100 hover:border-green-100 transition-all group text-left">
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 truncate">{p.name}</p>
                        <p className="text-sm text-gray-400 font-bold">₱{p.price} / {p.unit}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                  {sampleProducts.filter(p => p.seller === product.seller && p.id !== product.id).length === 0 && (
                    <p className="text-gray-400 font-medium italic">No other products from this seller yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ───────────────────────────────────── */}
        {related.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">You may also like</h2>
              <button onClick={() => navigate('/marketplace')} className="text-sm font-black text-green-600 flex items-center gap-1 hover:underline underline-offset-4 decoration-2">
                Browse all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/30 hover:shadow-green-900/10 hover:-translate-y-1 transition-all text-left group"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">{p.category}</p>
                    <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{p.name}</h3>
                    <p className="text-sm text-gray-400 font-bold mb-3 flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{p.seller}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price / {p.unit}</p>
                        <p className="text-2xl font-black text-gray-900">₱{p.price}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
