import React from 'react';
import { Search, Leaf, Sun, Sprout, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LandingPageProps } from '../../types';
import { sampleProducts } from '../../data';
import ProductCard from '../ui/ProductCard';

const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] via-white to-[#E8F5E9]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#4CAF50] rounded-full opacity-5 blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC107] rounded-full opacity-5 blur-3xl animate-float-delayed"></div>
          <Sun className="absolute top-10 right-20 w-16 h-16 text-[#FFC107] opacity-20 animate-spin-slow" />
          <Sprout className="absolute bottom-32 left-20 w-20 h-20 text-[#4CAF50] opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-8 animate-slideInLeft">
              <div className="inline-block">
                <span className="bg-[#4CAF50] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🌱 Fresh from the Farm
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Buy Fresh Produce
                <span className="block text-[#4CAF50] mt-2">Direct from Farmers</span>
              </h1>
              <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                Connect with local farmers and access the freshest organic produce. Support your community while enjoying farm-to-table goodness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="bg-[#4CAF50] hover:bg-[#45A049] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Browse Marketplace
                </button>
                <button
                  onClick={() => navigate('/farmer-dashboard')}
                  className="bg-white hover:bg-gray-50 text-[#4CAF50] border-2 border-[#4CAF50] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Sell Your Harvest
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <h4 className="text-3xl font-black text-[#4CAF50]">500+</h4>
                  <p className="text-sm text-gray-600 font-semibold">Farmers</p>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-black text-[#4CAF50]">2k+</h4>
                  <p className="text-sm text-gray-600 font-semibold">Products</p>
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-black text-[#4CAF50]">10k+</h4>
                  <p className="text-sm text-gray-600 font-semibold">Happy Buyers</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-slideInRight">
              <div className="relative bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-3xl p-2 shadow-2xl transform hover:rotate-1 transition-transform">
                <img 
                  src="/src/assets/hero.jpg" 
                  alt="Fresh farm produce" 
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-[#FFC107] text-white px-4 py-2 rounded-full font-bold shadow-lg animate-float">
                100% Organic
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white text-[#4CAF50] px-4 py-2 rounded-full font-bold shadow-lg border-2 border-[#4CAF50] animate-float-delayed">
                Farm Fresh
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Featured Fresh Produce</h2>
          <p className="text-lg text-gray-600">Handpicked from our trusted farmers</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-[#4CAF50] hover:bg-[#45A049] text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>View All Products</span>
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl hover:bg-[#F9FBE7] transition-colors">
              <div className="bg-[#4CAF50] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Organic</h3>
              <p className="text-gray-600">All products are certified organic and grown without harmful chemicals</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-[#F9FBE7] transition-colors">
              <div className="bg-[#FFC107] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support Local</h3>
              <p className="text-gray-600">Buy directly from farmers in your community and strengthen local economy</p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:bg-[#F9FBE7] transition-colors">
              <div className="bg-[#8D6E63] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600">Every farmer is verified and products meet strict quality standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
