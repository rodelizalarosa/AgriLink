import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  ChevronLeft,
  Store,
  CreditCard,
  Tag,
  Info,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  seller: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  stock: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSummaryVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );

    if (summaryRef.current) {
      observer.observe(summaryRef.current);
    }

    return () => {
      if (summaryRef.current) {
        observer.unobserve(summaryRef.current);
      }
    };
  }, []);
  
  // Mock cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Fresh Red Tomatoes',
      seller: 'San Jose Farm',
      price: 85,
      unit: 'kg',
      quantity: 2,
      image: '🍅',
      stock: 50
    },
    {
      id: '2',
      name: 'Organic Eggplant',
      seller: 'Luzon Agri Hub',
      price: 65,
      unit: 'kg',
      quantity: 3,
      image: '🍆',
      stock: 30
    }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = cartItems.length > 0 ? 50 : 0;
  const discount = subtotal > 500 ? 50 : 0;
  const total = subtotal + shippingFee - discount;
  const freeShippingThreshold = 1000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* 🎭 Artistic Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#5ba409]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* 🗺️ Refined Step Indicator */}
        <div className="flex items-center justify-center mb-10 px-4">
          <div className="flex items-center w-full max-w-xl">
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => navigate('/marketplace')}>
              <div className="w-10 h-10 rounded-xl bg-white border border-[#5ba409] flex items-center justify-center text-[#5ba409] shadow-lg shadow-green-500/5 group-hover:scale-105 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <span className="mt-2 text-[9px] font-black uppercase tracking-widest text-[#5ba409]">Shop</span>
            </div>
            <div className="flex-1 h-[1px] mx-3 bg-[#5ba409]/30"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-[#5ba409] flex items-center justify-center text-white shadow-xl shadow-green-500/20 border-2 border-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="mt-2 text-[9px] font-black uppercase tracking-widest text-gray-900 border-b-2 border-[#5ba409]">Basket</span>
            </div>
            <div className="flex-1 h-[1px] mx-3 bg-gray-100"></div>
            <div className="flex flex-col items-center opacity-30">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="mt-2 text-[9px] font-black uppercase tracking-widest text-gray-400">Checkout</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* 🛒 Main List Section */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-50">
                    <ShoppingBag className="w-4 h-4 text-[#5ba409]" />
                  </div>
                  <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Your Basket</h2>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
                  Shopping <span className="text-[#5ba409]">Basket</span>
                </h1>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Subtotal</p>
                    <p className="text-lg font-black text-gray-900 tracking-tight">₱{subtotal}</p>
                 </div>
                 <div className="h-6 w-[1px] bg-gray-100 mx-1"></div>
                 <button onClick={() => navigate('/marketplace')} className="text-[#5ba409] hover:bg-green-50 p-1.5 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                 </button>
              </div>
            </div>

            <div className="space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative bg-white rounded-3xl p-5 md:p-6 border border-gray-100 hover:border-[#5ba409]/20 shadow-xl shadow-gray-200/20 hover:shadow-[#5ba409]/5 transition-all duration-500 overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 md:gap-8">
                      {/* Product Image Panel */}
                      <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-50/50 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-gray-50 group-hover:rotate-2 transition-transform duration-500">
                          {item.image}
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#5ba409]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                        </div>
                      </div>

                      {/* Content Panel */}
                      <div className="flex-1 w-full text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="inline-block w-fit mx-auto sm:mx-0 px-3 py-1 bg-[#5ba409]/5 text-[#5ba409] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#5ba409]/10">
                              {item.seller}
                            </span>
                            {item.stock < 10 && (
                              <span className="inline-block w-fit mx-auto sm:mx-0 text-[8px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                                Low Stock: {item.stock} left
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="absolute sm:static top-0 right-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1 tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mb-5 pl-3 border-l-2 border-gray-100">
                          Premium harvest verified by AgriLink.
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center bg-gray-50 p-1.5 rounded-xl border border-gray-100 shadow-inner w-fit mx-auto sm:mx-0">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-sm transition-all active:scale-95"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-black text-gray-900 text-base">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#5ba409] hover:bg-white hover:shadow-sm transition-all active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right flex-1 sm:flex-none">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 whitespace-nowrap">Total</p>
                             <p className="text-2xl font-black text-gray-900 tracking-tight">₱{item.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-500">
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight relative z-10">Basket is empty</h3>
                  <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto mb-8 relative z-10">
                    Your organic selections will appear here after browsing the marketplace.
                  </p>
                  <button 
                    onClick={() => navigate('/marketplace')}
                    className="relative z-10 flex items-center gap-4 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#5ba409] hover:-translate-y-1 active:scale-95 transition-all group/btn mx-auto"
                  >
                    Start Shopping
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              )}
            </div>

            {/* 📍 Info Feature Card */}
          </div>

          {/* 🧾 Compact Summary Sidebar */}
          <aside ref={summaryRef} className="w-full lg:w-[380px] lg:sticky lg:top-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden relative">
              
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Summary</h2>
                <div className="p-2 bg-gray-50 rounded-xl">
                   <Tag className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Shipping Progress */}
              <div className="mb-8 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Free Delivery Status</p>
                  <span className="text-[9px] font-black text-[#5ba409] uppercase">
                    {subtotal >= freeShippingThreshold ? 'Unlocked' : `₱${freeShippingThreshold - subtotal} left`}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-gradient-to-r from-[#5ba409] to-lime-500 transition-all duration-700 ease-out"
                    style={{ width: `${progressToFreeShipping}%` }}
                   ></div>
                </div>
              </div>

              {/* Promo Section */}
              <div className="mb-8">
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5ba409] opacity-50" />
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code?"
                    className="w-full pl-11 pr-24 py-3.5 bg-gray-50 border border-gray-100 focus:border-[#5ba409]/30 focus:bg-white rounded-xl outline-none font-bold text-sm text-gray-900 placeholder:text-gray-300 transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all">
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8 border-y border-gray-50 py-6">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-base font-black text-gray-900">₱{subtotal}</span>
                </div>
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping</span>
                    <Info className="w-3 h-3 text-blue-300" />
                  </div>
                  <span className="text-base font-black text-blue-500">
                   {subtotal >= freeShippingThreshold ? 'FREE' : `₱${shippingFee}`}
                  </span>
                </div>
                {discount > 0 && (
                   <div className="flex justify-between items-center px-4 py-2.5 bg-lime-50 rounded-xl border border-lime-100">
                    <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Bulk Savings</span>
                    <span className="text-lg font-black text-green-700">-₱{discount}</span>
                  </div>
                )}
              </div>

              {/* Final Total */}
              <div className="mb-8 px-1">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</p>
                  <span className="text-[8px] font-black text-gray-300 uppercase underline decoration-gray-100">Includes VAT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl md:text-5xl font-black text-[#5ba409] tracking-tighter">
                    ₱{subtotal >= freeShippingThreshold ? subtotal - discount : total}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                disabled={cartItems.length === 0}
                onClick={() => alert('Proceeding to checkout...')}
                className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-lg ${
                  cartItems.length > 0 
                  ? 'bg-gray-900 text-white hover:bg-black hover:-translate-y-1 active:scale-[0.98]' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                }`}
              >
                Checkout Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                 <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">
                   Secure Transaction Verified
                 </p>
                 <p className="text-[9px] text-[#5ba409] font-black uppercase tracking-[0.2em]">
                   AgriLink Core
                 </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 📱 Mobile Floating Summary Bar */}
      {cartItems.length > 0 && (
        <div className={`lg:hidden fixed bottom-8 left-4 right-4 z-[100] transition-all duration-500 transform ${
          isSummaryVisible ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}>
          <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-between gap-4 max-w-md mx-auto">
            <div className="pl-4">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Payable</p>
               <div className="flex items-baseline gap-1">
                 <p className="text-xl font-black text-gray-900 tracking-tight">
                   ₱{subtotal >= freeShippingThreshold ? subtotal - discount : total}
                 </p>
                 <span className="text-[8px] font-black text-[#5ba409] uppercase">VAT Inc.</span>
               </div>
            </div>
            <button 
              onClick={() => alert('Proceeding to checkout... 🔒')}
              className="bg-gray-900 text-white px-8 py-4 rounded-[1.75rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black active:scale-95 transition-all flex items-center gap-3"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default CartPage;
