import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Info, Map as MapIcon, ChevronRight, Phone, Clock, Star, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import customMapStyle from '../../assets/agrilink-map-style.json';
import { API_BASE_URL } from '../../api/apiConfig';

interface Farmer {
  id: number;
  name: string;
  farm_address: string;
  farm_city: string;
  farm_province: string;
  latitude: number;
  longitude: number;
  phone: string;
}

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('agrilink_isLoggedIn') === 'true';

  const [searchQuery, setSearchQuery] = useState('');
  const [viewState, setViewState] = useState({
    longitude: 123.7786,
    latitude: 10.2442,
    zoom: 12.5
  });
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [navigationInfo, setNavigationInfo] = useState<{ distance: string, duration: string } | null>(null);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [showAllFarms, setShowAllFarms] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  
  // Fetch farmers from API
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/farmers/all`);
        if (response.ok) {
          const data = await response.json();
          setFarmers(data);
          
          // Center map on first farmer if we have data
          if (data.length > 0) {
            setViewState(prev => ({
              ...prev,
              latitude: data[0].latitude,
              longitude: data[0].longitude,
              zoom: 12.5
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching farmers:', err);
      } finally {
        setLoadingFarmers(false);
      }
    };

    fetchFarmers();
  }, []);

  // Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setViewState(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 13
          }));
        },
        (error) => {
          console.warn("Geolocation error:", error);
          fetchUserProfileLocation();
        }
      );
    } else {
      fetchUserProfileLocation();
    }
  }, []);

  const fetchUserProfileLocation = async () => {
    const userId = localStorage.getItem('agrilink_id');
    const token = localStorage.getItem('agrilink_token');
    if (!userId || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setUserLocation({
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
          });
          setViewState(prev => ({
            ...prev,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            zoom: 13
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching user location:", err);
    }
  };

  // Calculate Route when farmer is selected
  useEffect(() => {
    if (!selectedFarmerId || !userLocation) {
      setRouteData(null);
      setNavigationInfo(null);
      setFocusMode(false);
      return;
    }

    const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);
    if (!selectedFarmer) return;

    getRoute(selectedFarmer);
  }, [selectedFarmerId, userLocation, farmers]);

  const getRoute = async (farmer: Farmer) => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token || !userLocation) return;

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${farmer.longitude},${farmer.latitude}?geometries=geojson&access_token=${token}`
      );
      const json = await query.json();
      if (json.routes && json.routes[json.routes.length - 1]) {
        const data = json.routes[json.routes.length - 1];
        const route = data.geometry.coordinates;
        
        setRouteData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        });

        const distKm = (data.distance / 1000).toFixed(1);
        const durMin = Math.floor(data.duration / 60);
        setNavigationInfo({
          distance: `${distKm} km`,
          duration: `${durMin} mins`
        });
      }
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  // Calculate distance between user and farmer
  const getDistanceString = (farmer: Farmer): string => {
    if (!userLocation) return '--';
    const R = 6371;
    const dLat = (farmer.latitude - userLocation.latitude) * Math.PI / 180;
    const dLon = (farmer.longitude - userLocation.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(farmer.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return `${d.toFixed(1)} km`;
  };

  // Filter farmers by search
  const filteredFarmers = farmers.filter(f => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return f.name.toLowerCase().includes(q) || 
           (f.farm_city && f.farm_city.toLowerCase().includes(q)) ||
           (f.farm_address && f.farm_address.toLowerCase().includes(q));
  });

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-80px)] bg-gray-50 overflow-x-hidden md:overflow-hidden">
      {/* Map Section - Top/Left */}
      <div className="w-full md:flex-1 h-[400px] md:h-full relative overflow-hidden bg-[#f0f4f8]">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={(e) => {
            if (!e.originalEvent.defaultPrevented) setSelectedFarmerId(null);
          }}
          mapStyle={customMapStyle as any}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || ''}
          style={{width: '100%', height: '100%'}}
        >
          <NavigationControl position="top-right" />
          
          {/* User Marker */}
          {userLocation && (
            <Marker 
              longitude={userLocation.longitude} 
              latitude={userLocation.latitude} 
              anchor="bottom"
            >
              <div className="relative group flex flex-col items-center">
                <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-pulse" />
                <div className="relative bg-white p-2 rounded-2xl shadow-xl border-2 border-blue-500 flex items-center justify-center z-10 scale-90 group-hover:scale-100 transition-transform">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="absolute -bottom-8 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Your Location
                </div>
                <div className="w-2 h-2 bg-blue-600 rounded-full absolute -bottom-1 shadow-sm" />
              </div>
            </Marker>
          )}

          {/* Route Layer */}
          {routeData && (
            <Source id="routeSource" type="geojson" data={routeData}>
              <Layer
                id="routeLayer"
                type="line"
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                }}
                paint={{
                  'line-color': '#5ba409',
                  'line-width': 6,
                  'line-opacity': 1,
                  'line-dasharray': [0.5, 0.5]
                }}
              />
            </Source>
          )}

          {filteredFarmers.map(farmer => {
            const isSelected = selectedFarmerId === farmer.id;
            // Conditional visibility for Focus Mode
            if (focusMode && !isSelected) return null;
            if (!showAllFarms && !isSelected) return null;

            return (
              <Marker 
                key={farmer.id} 
                longitude={farmer.longitude} 
                latitude={farmer.latitude}
                anchor="bottom"
                style={{ zIndex: isSelected ? 50 : 10 }}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedFarmerId(farmer.id);
                  setViewState({
                    ...viewState,
                    longitude: farmer.longitude,
                    latitude: farmer.latitude,
                    zoom: 15
                  });
                }}
              >
              <div className={`relative flex flex-col items-center justify-center transform transition-all duration-500 cursor-pointer ${isSelected ? 'scale-125' : 'hover:scale-110 hover:-translate-y-2'} ${!isSelected && selectedFarmerId ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}>
                
                {/* Premium Marker Pin */}
                <div className="relative group">
                  <div className={`absolute -inset-3 rounded-full bg-[#5ba409] opacity-20 transition-all duration-500 z-0 ${isSelected ? 'animate-ping' : 'scale-0 group-hover:scale-100'}`} />
                  
                  <div className={`relative w-12 h-12 bg-white rounded-full p-1 shadow-2xl border-2 transition-all duration-500 overflow-hidden flex items-center justify-center z-10 ${isSelected ? 'border-[#5ba409] ring-4 ring-[#5ba409]/20 shadow-green-500/40' : 'border-white hover:border-gray-100'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#74c311] to-[#4a8608] opacity-10" />
                    <MapPin className={`relative w-5 h-5 z-10 transition-colors ${isSelected ? 'text-[#5ba409] fill-[#5ba409]/20' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="w-1.5 h-1.5 bg-gray-900 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-sm z-0" />
                </div>

                {/* Premium Floating Popup */}
                {isSelected && (
                  <div className="absolute bottom-full mb-6 w-64 bg-white/95 backdrop-blur-2xl p-5 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-white z-50 animate-in fade-in slide-in-from-bottom-8 duration-500 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/95 backdrop-blur-2xl border-r border-b border-white rotate-45" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                         <span className="bg-[#5ba409]/10 text-[#5ba409] text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">Verified Farm</span>
                      </div>
                      <h3 className="font-black text-gray-900 text-lg leading-tight uppercase italic mb-1">{farmer.name}</h3>
                      <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" /> 
                        {farmer.farm_city}{farmer.farm_province ? `, ${farmer.farm_province}` : ''}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mb-4 flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-gray-400" /> 
                        {navigationInfo ? navigationInfo.distance : getDistanceString(farmer)} from your location
                      </p>
                      <button onClick={() => navigate(`/profile/${farmer.id}`)} className="w-full bg-[#5ba409] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#4a8608] transition-colors shadow-lg shadow-green-900/20 active:scale-95">
                        Visit Market
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </Marker>
            );
          })}
        </Map>
        
        {/* Floating UI Elements on Map */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-3 z-10 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col md:flex-row gap-2 pointer-events-auto">
            <button 
              onClick={() => setShowAllFarms(!showAllFarms)}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 group ${showAllFarms ? 'bg-green-50 text-[#5ba409] shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
              title={showAllFarms ? "Showing all farms" : "Showing selected only"}
            >
              <MapIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest pr-1 hidden md:block">
                {showAllFarms ? "View All" : "Focus Mode"}
              </span>
            </button>
            <div className="w-px h-6 bg-gray-100 hidden md:block" />
            <button 
              onClick={() => {
                if (userLocation) {
                  setViewState(prev => ({ ...prev, latitude: userLocation.latitude, longitude: userLocation.longitude, zoom: 14 }));
                }
              }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
              title="My Location"
            >
              <Navigation className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {selectedFarmerId && (
            <button 
              onClick={() => setFocusMode(!focusMode)}
              className={`bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-[1.25rem] shadow-xl border border-white/50 flex items-center gap-3 pointer-events-auto group active:scale-95 transition-all animate-in slide-in-from-left-4 duration-500 ${focusMode ? 'ring-2 ring-green-500/20' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${focusMode ? 'bg-[#5ba409] text-white' : 'bg-gray-100 text-gray-400'}`}>
                {focusMode ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-gray-400">Navigation Priority</p>
                <p className={`text-xs font-black italic uppercase leading-none ${focusMode ? 'text-[#5ba409]' : 'text-gray-600'}`}>
                  {focusMode ? "Focus Mode Active" : "Enable Focus Mode"}
                </p>
              </div>
            </button>
          )}
        </div>

        {/* Token warning */}
        {!import.meta.env.VITE_MAPBOX_TOKEN && (
          <div className="absolute bottom-4 left-4 max-w-[280px] bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl shadow-lg z-10 pointer-events-none">
            <p className="text-xs font-bold flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Mapbox Token Missing</p>
            <p className="text-[10px] mt-1 text-red-500">Add <code className="bg-red-100 px-1 rounded">VITE_MAPBOX_TOKEN</code> to your client/.env file.</p>
          </div>
        )}
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
              placeholder="Search by name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#5ba409]/20 transition-all outline-none text-gray-700 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-6 space-y-6 custom-scrollbar max-h-[500px] md:max-h-none">
          {!isLoggedIn && (
            <div className="bg-[#5ba409]/10 p-5 rounded-2xl border border-[#5ba409]/20 text-center">
              <h3 className="text-sm font-black text-[#5ba409] mb-1">Want to see farmers near YOU?</h3>
              <p className="text-xs font-medium text-gray-600 mb-4">Log in to view real-time locations and get direct routes from your exact location.</p>
              <button onClick={() => navigate('/login')} className="bg-[#5ba409] hover:bg-[#4a8608] text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 text-xs inline-flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Log In or Sign Up
              </button>
            </div>
          )}
          
          {/* Section: Farmers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#5ba409]" />
                Registered Farms
              </h3>
              <span className="text-xs font-bold text-[#5ba409] bg-green-50 px-2 py-1 rounded-full">
                {filteredFarmers.length} Found
              </span>
            </div>

            {loadingFarmers ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredFarmers.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200 text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {searchQuery ? 'No farms match your search' : 'No registered farms yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFarmers.map(farmer => (
                  <div 
                    key={farmer.id} 
                    className={`group p-4 bg-white border rounded-2xl hover:border-[#5ba409]/30 hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${selectedFarmerId === farmer.id ? 'border-[#5ba409]/50 shadow-md ring-2 ring-[#5ba409]/10' : 'border-gray-100'}`}
                    onClick={() => {
                      setSelectedFarmerId(farmer.id);
                      setViewState({
                        ...viewState,
                        longitude: farmer.longitude,
                        latitude: farmer.latitude,
                        zoom: 15
                      });
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-[#5ba409] transition-colors">{farmer.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {farmer.farm_city}{farmer.farm_province ? `, ${farmer.farm_province}` : ''}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                          <Navigation className="w-3 h-3" /> {selectedFarmerId === farmer.id && navigationInfo ? navigationInfo.distance : getDistanceString(farmer)} away
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs font-bold text-[#5ba409] flex items-center gap-1" onClick={(e) => { e.stopPropagation(); navigate(`/profile/${farmer.id}`); }}>
                        View Profile <ChevronRight className="w-4 h-4" />
                      </button>
                      {farmer.phone && (
                        <div className="flex space-x-2">
                          <button className="p-2 bg-green-50 text-[#5ba409] rounded-lg">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Navigation & Routes */}
           <div className="pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#5ba409]" />
              Navigation & Routes
            </h3>
            
            {!selectedFarmerId ? (
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200 text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select a farm to see routes</p>
              </div>
            ) : (
              <div className="bg-[#F9FBE7] rounded-3xl p-6 border border-[#5ba409]/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-5 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-4 border-blue-500 bg-white shadow-sm z-10"></div>
                    <div className="w-0.5 h-12 bg-dashed border-l-2 border-dashed border-gray-300 my-1"></div>
                    <div className="w-4 h-4 rounded-full bg-[#5ba409] shadow-lg shadow-green-900/20 z-10"></div>
                  </div>
                  <div className="flex-1 space-y-5">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Your Location</p>
                      <p className="text-sm font-black text-gray-800">
                        {userLocation ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}` : "Detecting..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5ba409] font-black uppercase tracking-widest mb-1">Destination</p>
                      <p className="text-sm font-black text-gray-800 underline decoration-[#5ba409]/30">
                        {farmers.find(f => f.id === selectedFarmerId)?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/60 p-3 rounded-2xl border border-white flex flex-col items-center justify-center">
                    <Clock className="w-4 h-4 text-[#5ba409] mb-1" />
                    <p className="text-[10px] font-black text-gray-400 uppercase">Est. Time</p>
                    <p className="text-sm font-black text-gray-900">{navigationInfo?.duration || '--'}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-2xl border border-white flex flex-col items-center justify-center">
                    <Navigation className="w-4 h-4 text-[#5ba409] mb-1" />
                    <p className="text-[10px] font-black text-gray-400 uppercase">Distance</p>
                    <p className="text-sm font-black text-gray-900">{navigationInfo?.distance || '--'}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const farm = farmers.find(f => f.id === selectedFarmerId);
                    if (farm) {
                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.latitude},${userLocation?.longitude}&destination=${farm.latitude},${farm.longitude}&travelmode=driving`, '_blank');
                    }
                  }}
                  className="w-full bg-[#5ba409] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(91,164,9,0.3)] hover:bg-[#4a8608] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" /> Start Navigation
                </button>
              </div>
            )}
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
