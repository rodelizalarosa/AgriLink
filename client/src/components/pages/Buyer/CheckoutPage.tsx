import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { sampleProducts } from '../../../data';
import type { Product } from '../../../types';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Banknote,
  ShieldCheck,
  Wallet
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const product: Product | undefined = sampleProducts.find(p => p.id === Number(id));
  const qty = Number(searchParams.get('qty')) || 1;

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gcash' | 'card'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [address, setAddress] = useState('123 Mango Street, Brgy. San Jose, Agritown');
  const [contactMessage, setContactMessage] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FBE7] gap-6">
        <h2 className="text-3xl font-black text-gray-900">Product not found for checkout</h2>
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-2xl font-black"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Marketplace
        </button>
      </div>
    );
  }

  const subtotal = product.price * qty;
  const deliveryFee = 50; // Mock flat fee
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Wait a bit before redirecting
      setTimeout(() => {
        navigate('/buyer-dashboard');
      }, 2500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F9FBE7] flex flex-col items-center justify-center -mt-20">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-green-900/10 text-center max-w-lg w-full mx-4 border border-green-100 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
          <p className="text-lg text-gray-500 font-medium mb-8">
            Thank you for your purchase. The farmer has been notified and your fresh produce is getting ready.
          </p>
          <p className="text-sm text-gray-400 font-bold mb-8">Redirecting to your dashboard...</p>
          <button 
            onClick={() => navigate('/buyer-dashboard')}
            className="w-full py-4 bg-gray-900 hover:bg-green-700 text-white rounded-2xl font-black transition-all shadow-xl"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBE7] pb-24">
      {/* ── Top Nav Strip ─────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-black text-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-lg font-black text-gray-900">Secure Checkout</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Delivery Details */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Delivery Details</h2>
                  <p className="text-sm font-bold text-gray-400">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Address</label>
                  <textarea 
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Instructions (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Leave package at the front gate"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Payment Method</h2>
                  <p className="text-sm font-bold text-gray-400">Choose how you want to pay.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'cod' 
                    ? 'border-green-500 bg-green-50/50 shadow-lg shadow-green-500/10' 
                    : 'border-gray-100 bg-white hover:border-green-200'
                  }`}
                >
                  <Banknote className={`w-8 h-8 mb-3 ${paymentMethod === 'cod' ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className="font-black text-gray-900">Cash on Delivery</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pay at doorstep</p>
                </button>

                <button 
                  onClick={() => setPaymentMethod('gcash')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'gcash' 
                    ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10' 
                    : 'border-gray-100 bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-black text-xs mb-3">GC</div>
                  <p className="font-black text-gray-900">GCash</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">E-Wallet</p>
                </button>

                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${
                    paymentMethod === 'card' 
                    ? 'border-purple-500 bg-purple-50/50 shadow-lg shadow-purple-500/10' 
                    : 'border-gray-100 bg-white hover:border-purple-200'
                  }`}
                >
                  <CreditCard className={`w-8 h-8 mb-3 ${paymentMethod === 'card' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <p className="font-black text-gray-900">Credit Card</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Visa/Mastercard</p>
                </button>
              </div>

              {paymentMethod === 'gcash' && (
                <div className="mt-6 p-5 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm font-bold text-blue-800">You will be redirected to the GCash portal securely after clicking "Place Order".</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/30 border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Order Summary</h2>
              
              {/* Product Info */}
              <div className="flex gap-4 pb-6 border-b border-gray-100 mb-6">
                <img src={product.image} alt={product.name} className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-100" />
                <div className="flex-1">
                  <p className="font-black text-gray-900 leading-tight">{product.name}</p>
                  <p className="text-xs font-bold text-gray-400 mt-1">Sold by: {product.seller}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-green-700">₱{product.price} / {product.unit}</span>
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg text-gray-600">Qty: {qty}</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold">Subtotal ({qty} items)</span>
                  <span className="font-black text-gray-900">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold">Delivery Fee</span>
                  <span className="font-black text-gray-900">₱{deliveryFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-5 bg-green-50 rounded-2xl border border-green-100 mb-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-green-700 uppercase tracking-widest">Total Payment</span>
                  <span className="text-3xl font-black text-green-700 tracking-tighter">₱{total.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-green-600/70 font-bold text-right">VAT included</p>
              </div>

              <button 
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl
                  ${isProcessing 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                    : 'bg-gray-900 hover:bg-green-700 text-white shadow-gray-900/20 active:scale-[0.98] hover:-translate-y-0.5'
                  }`}
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Place Order <CheckCircle className="w-6 h-6" /></>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secure & Encrypted Checkout
              </div>
            </div>
            
            {/* Guarantee Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm mb-1">Freshness Guarantee</p>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">Direct from {product.location}. If it isn't fresh upon delivery, you get a full refund within 24 hours.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
