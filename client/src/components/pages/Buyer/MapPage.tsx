import React, { useState } from 'react';
import { MapPin, Navigation, Search, Info, Map as MapIcon, ChevronRight, Phone, Clock, Star } from 'lucide-react';

interface Farmer {
  id: number;
  name: string;
  produce: string[];
  distance: string;
  rating: number;
  active: boolean;
}

const MapPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for farmers
  const farmers: Farmer[] = [
    {
      id: 1,
      name: "Juan's Organic Farm",
      produce: ["Vegetables", "Herbs"],
      distance: "1.2 km",
      rating: 4.8,
      active: true
    },
    {
      id: 2,
      name: "Green Valley Orchard",
      produce: ["Fruits", "Honey"],
      distance: "2.5 km",
      rating: 4.9,
      active: false
    },
    {
      id: 3,
      name: "Sunrise Poultry & Grains",
      produce: ["Eggs", "Corn", "Rice"],
      distance: "3.8 km",
      rating: 4.7,
      active: true
    },
    {
      id: 4,
      name: "Metro Urban Garden",
      produce: ["Microgreens", "Lettuce"],
      distance: "0.8 km",
      rating: 5.0,
      active: true
    }
  ];

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-80px)] bg-gray-50 overflow-x-hidden md:overflow-hidden">
      {/* Map Section - Top/Left */}
      <div className="w-full md:flex-1 h-[400px] md:h-full relative flex items-center justify-center overflow-hidden bg-[#f0f4f8]">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#5ba409 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Map Placeholder Content */}
        <div className="relative z-10 text-center p-6 md:p-8 max-w-lg">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
            <MapIcon className="w-8 h-8 md:w-12 md:h-12 text-[#5ba409]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Interactive Map Coming Soon</h2>
          <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed">
            We're currently integrating with our logistics partners to provide you with real-time farmer locations and optimized delivery routes.
          </p>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm flex flex-col items-center">
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#5ba409] mb-1.5 md:mb-2" />
              <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Tracking</span>
            </div>
            <div className="p-3 md:p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm flex flex-col items-center">
              <Navigation className="w-5 h-5 md:w-6 md:h-6 text-[#5ba409] mb-1.5 md:mb-2" />
              <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">Route Optimization</span>
            </div>
          </div>
        </div>
        
        {/* Floating UI Elements on Map */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex space-x-2">
          <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-white/50 flex space-x-2">
            <button className="p-2 bg-green-50 text-[#5ba409] rounded-lg hover:bg-green-100 transition-colors">
              <MapIcon className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
              <Navigation className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Panel - Bottom/Right */}
      <div className="w-full md:w-[400px] md:h-full bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col shadow-2xl z-20">
        {/* Panel Header */}
        <div className="p-5 md:p-6 border-b border-gray-100">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Find Local Farmers</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by farm or product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#5ba409]/20 transition-all outline-none text-gray-700 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-6 space-y-6 custom-scrollbar max-h-[500px] md:max-h-none">
          {/* Section: Active Farmers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#5ba409]" />
                Farmers Near You
              </h3>
              <span className="text-xs font-bold text-[#5ba409] bg-green-50 px-2 py-1 rounded-full">
                {farmers.length} Found
              </span>
            </div>

            <div className="space-y-4">
              {farmers.map(farmer => (
                <div 
                  key={farmer.id} 
                  className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#5ba409]/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#5ba409] transition-colors">{farmer.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> {farmer.distance} away
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-700">{farmer.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {farmer.produce.map((item, idx) => (
                      <span key={idx} className="text-[11px] font-semibold bg-gray-50 text-gray-600 px-2 py-1 rounded-md uppercase tracking-tight">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-bold text-[#5ba409] flex items-center gap-1">
                      View Profile <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-green-50 text-[#5ba409] rounded-lg">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Possible Routes */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#5ba409]" />
              Recommended Routes
            </h3>
            
            <div className="bg-[#F9FBE7] rounded-2xl p-5 border border-[#5ba409]/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-[#5ba409] bg-white"></div>
                  <div className="w-0.5 h-8 bg-dashed border-l-2 border-dashed border-gray-300 my-1"></div>
                  <div className="w-3 h-3 rounded-full bg-[#5ba409]"></div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Current Location</p>
                    <p className="text-sm font-semibold text-gray-700">Metro Manila, PH</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#5ba409] font-bold uppercase tracking-widest">Destination</p>
                    <p className="text-sm font-semibold text-gray-700 underline decoration-[#5ba409]/30">Juan's Organic Farm</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm py-3 border-t border-[#5ba409]/10">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Est. Time: <b>15 mins</b></span>
                </div>
                <button className="bg-[#5ba409] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#5ba409]/20 hover:scale-105 transition-transform active:scale-95">
                  Start Navigation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Support Local</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Direct routes reduce carbon footprint and support our local farmers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
