import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Modal from '../ui/Modal';
import MapBoxMap, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import customMapStyle from '../../assets/agrilink-map-style.json';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Save, 
  Shield, 
  Bell, 
  Map, 
  Truck, 
  Sprout,
  ArrowRight,
  Package,
  Clock,
  Eye,
  CheckCircle,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Landmark,
  ShieldCheck,
  History,
  LayoutDashboard
} from 'lucide-react';
import { sampleProducts } from '../../data';
import DashboardCard from '../ui/DashboardCard';
import type { UserProfile } from '../../types';
import { API_BASE_URL } from '../../api/apiConfig';

interface ProfilePageProps {
  userType: string;
}
const ProfilePage: React.FC<ProfilePageProps> = ({ userType }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isReadOnly = !!id; // if an ID is passed in the URL, viewing another profile
  
  const isNewUser = searchParams.get('setup') === 'true';
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem('agrilink_id');
  const targetUserId = id || currentUserId;

  const [profile, setProfile] = useState<UserProfile>({
    id: targetUserId || '0',
    firstName: localStorage.getItem('agrilink_firstName') || '',
    lastName: localStorage.getItem('agrilink_lastName') || '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    userType: userType as any,
    farmAddress: '',
    farmCity: '',
    farmProvince: '',
    farmZipCode: '',
    farmAddressSameAsHome: true,
  });

  const [viewState, setViewState] = useState({
    longitude: 123.8854,
    latitude: 10.3157,
    zoom: 13
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'personal' | 'security' | 'role'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!targetUserId) return;
      try {
        const token = localStorage.getItem('agrilink_token');
        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${targetUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          userType === 'buyer' ? fetch(`${API_BASE_URL}/purchases/buyer/${targetUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }) : Promise.resolve(null)
        ]);

        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        const userData = await profileRes.json();
        
        setProfile({
          id: userData.id.toString(),
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          province: userData.province || '',
          zipCode: userData.zip_code || '',
          userType: userData.role,
          profileImage: userData.profile_image || userData.image_path || '/mongg.jpg',
          bio: userData.bio || 'Passionate about sustainable agriculture and community-driven food systems.',
          farmAddress: userData.farm_address || '',
          farmCity: userData.farm_city || '',
          farmProvince: userData.farm_province || '',
          farmZipCode: userData.farm_zip_code || '',
          farmLatitude: userData.farm_latitude ? parseFloat(userData.farm_latitude) : undefined,
          farmLongitude: userData.farm_longitude ? parseFloat(userData.farm_longitude) : undefined,
          farmAddressSameAsHome: userData.farm_address_same_as_home === 1 || userData.farm_address_same_as_home === true,
        });

        if (ordersRes && ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }
        
        if (userData.latitude && userData.longitude) {
          setViewState(prev => ({
            ...prev,
            latitude: parseFloat(userData.latitude),
            longitude: parseFloat(userData.longitude)
          }));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    if (isNewUser) {
      setShowSetupModal(true);
    }
  }, [targetUserId, isNewUser]);

  const handleSaveSetup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${targetUserId}/onboarding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          province: profile.province,
          zip_code: profile.zipCode,
          latitude: profile.latitude,
          longitude: profile.longitude,
          farm_address: profile.farmAddress,
          farm_city: profile.farmCity,
          farm_province: profile.farmProvince,
          farm_zip_code: profile.farmZipCode,
          farm_latitude: profile.farmLatitude,
          farm_longitude: profile.farmLongitude,
          farm_address_same_as_home: profile.farmAddressSameAsHome
        })
      });

      if (response.ok) {
        localStorage.setItem('agrilink_onboarding_completed', '1');
        // Dispatch custom event to notify App.tsx
        window.dispatchEvent(new CustomEvent('agrilink-onboarding-completed'));
        
        setShowSetupModal(false);
        navigate(profile.userType === 'farmer' ? '/farmer/dashboard' : '/marketplace');
        toast.success('Profile setup complete!');
      } else {
        toast.error('Failed to save profile setup');
      }
    } catch (err) {
      console.error('Setup error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  // 🌍 Auto-Geocode Address for Setup Modal
  useEffect(() => {
    if (!showSetupModal || !profile.address || profile.address.length < 5) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const query = encodeURIComponent(`${profile.address}, ${profile.city}, ${profile.province}, Philippines`);
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        
        if (!token) return;

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&limit=1&country=ph`
        );
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          
          setProfile(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }));
          
          setViewState(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            zoom: 15
          }));
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [profile.address, profile.city, profile.province, showSetupModal]);


  // If reading only, override type to farmer (for demo purposes)
  const effectiveUserType = isReadOnly ? 'farmer' : userType;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('agrilink_token');
      const response = await fetch(`${API_BASE_URL}/users/${profile.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          province: profile.province,
          zip_code: profile.zipCode,
          latitude: profile.latitude,
          longitude: profile.longitude,
          farm_address: profile.farmAddress,
          farm_city: profile.farmCity,
          farm_province: profile.farmProvince,
          farm_zip_code: profile.farmZipCode,
          farm_latitude: profile.farmLatitude,
          farm_longitude: profile.farmLongitude,
          farm_address_same_as_home: profile.farmAddressSameAsHome,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully! 🌿');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('An error occurred while saving. Please try again.');
    }
  };

  const renderDashboardContent = () => {
    const isBuyer = profile.userType === 'buyer';
    const isFarmer = profile.userType === 'farmer';

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase mb-2">
            Account Overview<span className="text-[#5ba409]">.</span>
          </h2>
          <p className="text-gray-500 font-medium">Manage your activity and view your recent performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isBuyer ? (
            <>
              <DashboardCard 
                icon={ShoppingBag} 
                title="Total Orders" 
                value={orders.length.toString()} 
                subtitle="Items purchased" 
                color="#5ba409" 
              />
              <DashboardCard 
                icon={Clock} 
                title="Pending" 
                value={orders.filter(o => o.req_status === 'Pending').length.toString()} 
                subtitle="Awaiting confirmation" 
                color="#FF9800" 
              />
              <DashboardCard 
                icon={Wallet} 
                title="Total Spent" 
                value={`₱${orders.reduce((sum, o) => sum + (o.quantity * o.p_price), 0).toLocaleString()}`} 
                subtitle="Lifetime investment" 
                color="#2196F3" 
              />
            </>
          ) : isFarmer ? (
            <>
              <DashboardCard 
                icon={TrendingUp} 
                title="Live Listings" 
                value="12" 
                subtitle="Active products" 
                color="#5ba409" 
              />
              <DashboardCard 
                icon={Landmark} 
                title="Revenue" 
                value="₱12.4k" 
                subtitle="This month" 
                color="#2196F3" 
              />
              <DashboardCard 
                icon={ShieldCheck} 
                title="Health" 
                value="98%" 
                subtitle="Fulfillment rate" 
                color="#9C27B0" 
              />
            </>
          ) : (
            <div className="col-span-3 p-8 bg-gray-50 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="w-8 h-8 text-[#5ba409]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Administrative Oversight</h3>
              <p className="text-sm text-gray-500">You have access to global management tools across the AgriLink platform.</p>
            </div>
          )}
        </div>

        {isBuyer && orders.length > 0 && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900 italic uppercase">Recent Activity</h3>
              <button 
                onClick={() => setActiveTab('role')}
                className="text-[10px] font-black text-[#5ba409] uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2"
              >
                View History <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.req_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-[#5ba409]/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#5ba409] font-black italic">
                      {order.p_name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-none mb-1">{order.p_name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.req_status} • {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="font-black text-gray-900 italic">₱{(order.quantity * order.p_price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRoleTabForBuyer = () => {
    const processingOrders = orders.filter(o => o.req_status === 'Pending' || o.req_status === 'Processing');
    const completedOrders = orders.filter(o => o.req_status === 'Completed' || o.req_status === 'Delivered');

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <Package className="w-7 h-7 text-[#5ba409]" />
            Purchase History
          </h3>
          
          <div className="space-y-8">
            {/* Incoming Orders */}
            <div>
              <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Incoming & Active
              </h4>
              <div className="space-y-4">
                {processingOrders.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 font-bold italic uppercase text-[10px] tracking-widest">
                    No active orders currently
                  </div>
                ) : (
                  processingOrders.map((order) => (
                    <div key={order.req_id} className="bg-white p-5 rounded-2xl border-2 border-amber-100 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center">
                      <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                        <Truck className="w-8 h-8 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-black text-gray-900 text-lg uppercase italic">{order.p_name}</h5>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.req_status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {order.req_status}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Order #ORD-{order.req_id.toString().padStart(4, '0')} • Farm ID: {order.u_id}</p>
                        <p className="text-sm text-gray-400">Date Started: <span className="text-gray-700 font-bold">{new Date(order.created_at).toLocaleDateString()}</span></p>
                      </div>
                      <div className="text-right shrink-0 min-w-[100px]">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-black text-gray-900">₱{(order.quantity * order.p_price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Orders */}
            <div>
              <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Success History
              </h4>
              <div className="space-y-4">
                {completedOrders.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 font-bold italic uppercase text-[10px] tracking-widest">
                    No completed purchases yet
                  </div>
                ) : (
                  completedOrders.map((order) => (
                    <div key={order.req_id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors flex flex-col md:flex-row gap-5 items-start md:items-center">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-black text-gray-900 text-lg uppercase italic">{order.p_name}</h5>
                          <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> {order.req_status === 'Delivered' ? 'Delivered' : 'Fulfilled'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Order #ORD-{order.req_id.toString().padStart(4, '0')} • Finalized on: {new Date(order.updated_at || order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right shrink-0 min-w-[100px] flex flex-col items-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 hidden md:block">Total</p>
                        <div className="flex justify-between md:block w-full">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 md:hidden">Total</span>
                          <p className="text-xl font-black text-gray-900 mb-2">₱{(order.quantity * order.p_price).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/product/${order.p_id}`)}
                          className="text-xs font-black text-[#5ba409] hover:underline underline-offset-2 bg-green-50 px-4 py-2 rounded-xl"
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRoleSpecificContent = () => {
    if (profile.userType === 'farmer') {
      const farmerProducts = sampleProducts.filter(p => isReadOnly ? p.seller === "Juan dela Cruz" : true).slice(0, 4);
      
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Sprout className="w-6 h-6 mr-2 text-[#5ba409]" />
            {isReadOnly ? 'Farm Information' : 'My Farm Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={profile.farmName || 'Green Valley Organic Farm'}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Total Land Area</label>
              <div className="relative">
                <Map className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="farmSize"
                  value={profile.farmSize || '5 Hectares'}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Delivery Range</label>
              <div className="relative">
                <Truck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="deliveryRange"
                  value={profile.deliveryRange || '25km'}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-900 mb-3">{isReadOnly ? 'Listed Produce' : 'Primary Produce'}</h4>
            
            {isReadOnly ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {farmerProducts.map(p => (
                  <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-[#5ba409] hover:shadow-lg transition-all group">
                    <div className="h-24 overflow-hidden relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-black">{p.category}</div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                      <p className="text-[#5ba409] font-black text-sm">₱{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {['Vegetables', 'Fruits', 'Organic Rice', 'Spices'].map(tag => (
                  <span key={tag} className="bg-green-50 text-[#5ba409] px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                    {tag}
                  </span>
                ))}
                <button className="text-gray-400 hover:text-[#5ba409] border-2 border-dashed border-gray-200 rounded-full px-3 py-0.5 text-sm font-bold transition-colors">
                  + Add Category
                </button>
              </div>
            )}
          </div>
        </div>
      );
    } else if (profile.userType === 'buyer') {
      return renderRoleTabForBuyer();
    } else if (profile.userType === 'brgy_official') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-[#5ba409]" />
            Barangay Jurisdiction
          </h3>
          <div className="bg-emerald-50 rounded-xl p-6">
            <p className="text-emerald-800 font-bold mb-2">Assigned Barangay: San Jose</p>
            <p className="text-sm text-emerald-600">You are responsible for managing farmer listings and coordinating local orders within this jurisdiction.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border-2 border-gray-100 rounded-xl">
              <p className="text-xs font-black text-gray-400 uppercase">Farmers Managed</p>
              <p className="text-xl font-bold text-gray-900">42</p>
            </div>
            <div className="p-4 border-2 border-gray-100 rounded-xl">
              <p className="text-xs font-black text-gray-400 uppercase">Active Listings</p>
              <p className="text-xl font-bold text-gray-900">128</p>
            </div>
          </div>
        </div>
      );
    } else if (profile.userType === 'lgu_official') {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-indigo-600" />
            LGU Authorization
          </h3>
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <p className="text-indigo-900 font-bold mb-2">Representative ID: LGU-MLY-2026-089</p>
            <p className="text-sm text-indigo-700">Authorized to perform platform-wide moderation, listing validation, and inter-barangay coordination.</p>
          </div>
          <button className="w-full py-3 bg-white border-2 border-indigo-200 text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-all">
            Update Security Credentials
          </button>
        </div>
      );
    } else {
      return (
        <div className="p-8 text-center bg-gray-50 rounded-2xl">
          <Shield className="w-16 h-16 text-[#5ba409] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">System Administrator</h3>
          <p className="text-gray-600">You have full access to system management and user oversight tools.</p>
        </div>
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'personal':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Fields... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Last Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#5ba409]" />
                Home Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Province</label>
                  <input
                    type="text"
                    name="province"
                    value={profile.province}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
              </div>
            </div>

            {/* Farm Address Section - Only for farmers */}
            {profile.userType === 'farmer' && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Sprout className="w-5 h-5 mr-2 text-[#5ba409]" />
                  Farm Address
                </h3>

                {/* Same as home toggle */}
                <label className="flex items-center gap-3 mb-6 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={profile.farmAddressSameAsHome}
                      onChange={(e) => setProfile({ ...profile, farmAddressSameAsHome: e.target.checked })}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#5ba409] transition-colors peer-disabled:opacity-50" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Same as home address
                  </span>
                </label>

                {/* Show farm address fields only when NOT same as home */}
                {!profile.farmAddressSameAsHome && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700">Farm Street Address</label>
                      <input
                        type="text"
                        name="farmAddress"
                        value={profile.farmAddress || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter farm location address"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Farm City</label>
                      <input
                        type="text"
                        name="farmCity"
                        value={profile.farmCity || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="City / Municipality"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Farm Province</label>
                      <input
                        type="text"
                        name="farmProvince"
                        value={profile.farmProvince || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Province"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Farm Zip Code</label>
                      <input
                        type="text"
                        name="farmZipCode"
                        value={profile.farmZipCode || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Zip Code"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                      />
                    </div>
                  </div>
                )}

                {profile.farmAddressSameAsHome && (
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5ba409]/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#5ba409]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-900">Farm is at your home address</p>
                      <p className="text-xs text-green-700">{profile.address}{profile.city ? `, ${profile.city}` : ''}{profile.province ? `, ${profile.province}` : ''}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-xl">
              <div className="flex">
                <Shield className="h-6 w-6 text-orange-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-orange-800">Security Recommendation</h3>
                  <p className="text-sm text-orange-700 mt-1">We recommend changing your password every 3 months for better security.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="bg-[#5ba409] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4d8f08] transition-colors mt-4">
                Update Password
              </button>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-[#5ba409]" />
                Notification Preferences
              </h3>
              <div className="space-y-3">
                {[
                  'Email notifications for new orders',
                  'SMS alerts for delivery updates',
                  'Marketing updates and newsletters',
                  'System announcements'
                ].map((pref, idx) => (
                  <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked={idx < 2} />
                      <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors group-has-[:checked]:bg-[#5ba409]"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform group-has-[:checked]:translate-x-4 shadow-sm"></div>
                    </div>
                    <span className="text-gray-700 font-medium">{pref}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 'role':
        if (effectiveUserType === 'farmer') {
          const farmerProducts = sampleProducts.filter(p => isReadOnly ? p.seller === "Juan dela Cruz" : true).slice(0, 4);
          
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Sprout className="w-6 h-6 mr-2 text-[#5ba409]" />
                {isReadOnly ? 'Farm Information' : 'My Farm Information'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Farm Name</label>
                  <input
                    type="text"
                    name="farmName"
                    value={profile.farmName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Total Land Area</label>
                  <div className="relative">
                    <Map className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="farmSize"
                      value={profile.farmSize}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Delivery Range</label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="deliveryRange"
                      value={profile.deliveryRange}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#5ba409] focus:outline-none transition-all disabled:opacity-70"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3">{isReadOnly ? 'Listed Produce' : 'Primary Produce'}</h4>
                
                {isReadOnly ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {farmerProducts.map(p => (
                      <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="bg-white rounded-xl overflow-hidden border border-gray-100 cursor-pointer hover:border-[#5ba409] hover:shadow-lg transition-all group">
                        <div className="h-24 overflow-hidden relative">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-black">{p.category}</div>
                        </div>
                        <div className="p-3">
                          <p className="font-bold text-gray-900 text-sm truncate">{p.name}</p>
                          <p className="text-[#5ba409] font-black text-sm">₱{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {['Vegetables', 'Fruits', 'Organic Rice', 'Spices'].map(tag => (
                      <span key={tag} className="bg-green-50 text-[#5ba409] px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                        {tag}
                      </span>
                    ))}
                    <button className="text-gray-400 hover:text-[#5ba409] border-2 border-dashed border-gray-200 rounded-full px-3 py-0.5 text-sm font-bold transition-colors">
                      + Add Category
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        } else if (effectiveUserType === 'buyer') {
          return (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            

              {/* Order History */}
              <div>
                 <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <Package className="w-7 h-7 text-[#5ba409]" />
                  Order History
                </h3>
                
                <div className="space-y-8">
                  {/* Incoming Orders */}
                  <div>
                    <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Incoming Orders
                    </h4>
                    <div className="space-y-4">
                      {/* Order Item */}
                      <div className="bg-white p-5 rounded-2xl border-2 border-amber-100 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <Truck className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h5 className="font-black text-gray-900 text-lg">Fresh Carabao Mangoes</h5>
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Processing</span>
                          </div>
                          <p className="text-sm font-bold text-gray-500 mb-1">Order #ORD-2026-089 • Sold by: Mang Jose</p>
                          <p className="text-sm text-gray-400">Expected Delivery: <span className="text-gray-700 font-bold">Tomorrow, 2:00 PM</span></p>
                        </div>
                        <div className="text-right shrink-0 min-w-[100px]">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                          <p className="text-2xl font-black text-gray-900">₱450</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Completed Orders */}
                  <div>
                    <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Completed Orders
                    </h4>
                    <div className="space-y-4">
                      {[
                        { id: 'ORD-2026-075', name: 'Organic Roma Tomatoes', seller: 'Green Valley Organic Farm', date: 'Feb 28, 2026', total: '₱240' },
                        { id: 'ORD-2026-062', name: 'Free-Range Brown Eggs', seller: 'Ana\'s Poultry', date: 'Feb 25, 2026', total: '₱180' }
                      ].map((order, i) => (
                        <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors flex flex-col md:flex-row gap-5 items-start md:items-center">
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-black text-gray-900 text-lg">{order.name}</h5>
                              <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Delivered
                              </span>
                            </div>
                            <p className="text-sm font-bold text-gray-500 mb-1">Order #{order.id} • Sold by: {order.seller}</p>
                            <p className="text-sm text-gray-400">Delivered on: <span className="text-gray-700 font-bold">{order.date}</span></p>
                          </div>
                          <div className="text-right shrink-0 min-w-[100px] flex flex-col items-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 hidden md:block">Total</p>
                            <div className="flex justify-between md:block w-full">
                              <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 md:hidden">Total</span>
                              <p className="text-xl font-black text-gray-900 mb-2">{order.total}</p>
                            </div>
                            <button className="text-xs font-black text-[#5ba409] hover:underline underline-offset-2 bg-green-50 px-4 py-2 rounded-xl">Buy Again</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        } else if (effectiveUserType === 'brgy_official') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-[#5ba409]" />
                Barangay Jurisdiction
              </h3>
              <div className="bg-emerald-50 rounded-xl p-6">
                <p className="text-emerald-800 font-bold mb-2">Assigned Barangay: San Jose</p>
                <p className="text-sm text-emerald-600">You are responsible for managing farmer listings and coordinating local orders within this jurisdiction.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-gray-100 rounded-xl">
                  <p className="text-xs font-black text-gray-400 uppercase">Farmers Managed</p>
                  <p className="text-xl font-bold text-gray-900">42</p>
                </div>
                <div className="p-4 border-2 border-gray-100 rounded-xl">
                  <p className="text-xs font-black text-gray-400 uppercase">Active Listings</p>
                  <p className="text-xl font-bold text-gray-900">128</p>
                </div>
              </div>
            </div>
          );
        } else if (effectiveUserType === 'lgu_official') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-indigo-600" />
                LGU Authorization
              </h3>
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                <p className="text-indigo-900 font-bold mb-2">Representative ID: LGU-MLY-2026-089</p>
                <p className="text-sm text-indigo-700">Authorized to perform platform-wide moderation, listing validation, and inter-barangay coordination.</p>
              </div>
              <button className="w-full py-3 bg-white border-2 border-indigo-200 text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                Update Security Credentials
              </button>
            </div>
          );
        } else {
          return (
            <div className="p-8 text-center bg-gray-50 rounded-2xl">
              <Shield className="w-16 h-16 text-[#5ba409] mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">System Administrator</h3>
              <p className="text-gray-600">You have full access to system management and user oversight tools.</p>
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-[#5ba409] to-[#8BC34A] relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
          </div>
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row items-end -mt-16 mb-8 gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-8 border-white overflow-hidden shadow-2xl bg-gray-100 ring-4 ring-green-50">
                  <img 
                    src={profile.profileImage} 
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-3 bg-[#5ba409] text-white rounded-2xl shadow-lg hover:scale-110 transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Profile Header Info */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                      {isReadOnly ? 'Juan dela Cruz' : `${profile.firstName} ${profile.lastName}`}
                      {isReadOnly && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-bold border border-blue-100 flex items-center"><Eye className="w-3 h-3 mr-1"/> View Only</span>}
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-green-100 text-[#5ba409] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        {effectiveUserType}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.city}, {profile.province}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {!isReadOnly && (
                      !isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all flex items-center space-x-2"
                        >
                          <User className="w-5 h-5" />
                          <span>Edit Profile</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleSave}
                          className="bg-[#5ba409] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#4d8f08] transition-all flex items-center space-x-2"
                        >
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-[#5ba409] shadow-md scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Account Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('personal')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'personal' 
                    ? 'bg-white text-[#5ba409] shadow-md scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Personal Info</span>
              </button>
              
              {profile.userType !== 'admin' && (
                <button
                  onClick={() => setActiveTab('role')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'role' 
                      ? 'bg-white text-[#5ba409] shadow-md scale-[1.02]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {profile.userType === 'farmer' ? (
                    <Sprout className="w-5 h-5" />
                  ) : profile.userType === 'buyer' ? (
                    <History className="w-5 h-5" />
                  ) : (
                     <ShieldCheck className="w-5 h-5" />
                  )}
                  <span>{profile.userType === 'farmer' ? 'Farm Details' : 'Activity History'}</span>
                </button>
              )}

              {!isReadOnly && (
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'security' 
                      ? 'bg-white text-[#5ba409] shadow-md scale-[1.02]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Security</span>
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Setup Modal for New Users */}
      <Modal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        title="Welcome to AgriLink! 🌱"
        size="2xl"
      >
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-3xl border border-green-100 mb-6">
            <h3 className="text-xl font-black text-green-900 mb-2">Almost there!</h3>
            <p className="text-green-800/70 text-sm font-medium">
              {profile.userType === 'farmer'
                ? "Let's set up your merchant profile so you can start selling your harvests."
                : "To start buying fresh produce, we just need a few more details to help with delivery and coordination."}
            </p>
          </div>

          <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
            {/* Common: Mobile Number */}
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm transition-all hover:border-green-100">
              <label className="block text-xs font-black text-[#5ba409] uppercase tracking-widest mb-3">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-green-600 rounded-2xl outline-none font-bold transition-all text-sm"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Home/Delivery Address Section */}
            <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm transition-all hover:border-green-100">
              <label className="block text-xs font-black text-green-600 uppercase tracking-widest mb-3">
                {profile.userType === 'farmer' ? "Home Address" : "Delivery Address"}
              </label>
              <div className="relative mb-4">
                <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  placeholder="Street Name, Barangay, City, Province"
                  rows={2}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all resize-none text-sm"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <input
                  placeholder="City"
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-xl outline-none font-bold text-xs"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                />
                <input
                  placeholder="Province"
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-xl outline-none font-bold text-xs"
                  value={profile.province}
                  onChange={(e) => setProfile({ ...profile, province: e.target.value })}
                />
                <input
                  placeholder="ZIP"
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-xl outline-none font-bold text-xs"
                  value={profile.zipCode}
                  onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                />
              </div>

              {/* Home Map (only if buyer or if farmer and wants to pin home) */}
              <div className="w-full h-[200px] border-2 border-green-100 rounded-2xl overflow-hidden relative shadow-inner">
                <MapBoxMap
                  {...viewState}
                  onMove={evt => setViewState(evt.viewState)}
                  mapStyle={customMapStyle as any}
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || ''}
                  style={{width: '100%', height: '100%'}}
                  onClick={(e) => {
                    setProfile(prev => ({
                      ...prev,
                      latitude: e.lngLat.lat,
                      longitude: e.lngLat.lng,
                      ...(prev.farmAddressSameAsHome ? { farmLatitude: e.lngLat.lat, farmLongitude: e.lngLat.lng } : {})
                    }));
                  }}
                >
                  {profile.latitude && profile.longitude && (
                    <Marker longitude={profile.longitude} latitude={profile.latitude} anchor="bottom">
                      <div className="text-[#5ba409] drop-shadow-lg">
                        <MapPin className="w-8 h-8 fill-white" />
                      </div>
                    </Marker>
                  )}
                </MapBoxMap>
                <div className="absolute top-2 left-0 right-0 flex justify-center z-10 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg text-[9px] font-black text-[#5ba409] uppercase tracking-widest border border-green-100 pointer-events-auto">
                    Pin Home Location
                  </div>
                </div>
              </div>
            </div>

            {/* Farm Section for Farmers */}
            {(profile.role === 'farmer' || profile.userType === 'farmer') && (
              <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm transition-all hover:border-orange-100 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-black text-orange-600 uppercase tracking-widest">Farm Location</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${profile.farmAddressSameAsHome ? 'bg-green-600' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 transform ${profile.farmAddressSameAsHome ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={profile.farmAddressSameAsHome}
                      onChange={(e) => setProfile({ ...profile, farmAddressSameAsHome: e.target.checked })}
                    />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600">Same as home</span>
                  </label>
                </div>

                {!profile.farmAddressSameAsHome && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                      <Sprout className="absolute left-4 top-4 text-orange-400 w-5 h-5" />
                      <textarea
                        placeholder="Farm Street Address"
                        rows={2}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl outline-none font-bold transition-all resize-none text-sm"
                        value={profile.farmAddress}
                        onChange={(e) => setProfile({ ...profile, farmAddress: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        placeholder="City"
                        className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none font-bold text-xs"
                        value={profile.farmCity}
                        onChange={(e) => setProfile({ ...profile, farmCity: e.target.value })}
                      />
                      <input
                        placeholder="Province"
                        className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none font-bold text-xs"
                        value={profile.farmProvince}
                        onChange={(e) => setProfile({ ...profile, farmProvince: e.target.value })}
                      />
                      <input
                        placeholder="ZIP"
                        className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none font-bold text-xs"
                        value={profile.farmZipCode}
                        onChange={(e) => setProfile({ ...profile, farmZipCode: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {profile.farmAddressSameAsHome ? (
                  <div className="p-4 bg-orange-50 border-2 border-dashed border-orange-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 opacity-80">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Using Home Coordinates</p>
                  </div>
                ) : (
                  <div className="h-[200px] border-2 border-orange-100 rounded-2xl overflow-hidden relative shadow-inner mt-4">
                    <MapBoxMap
                      longitude={profile.farmLongitude || profile.longitude || 123.8854}
                      latitude={profile.farmLatitude || profile.latitude || 10.3157}
                      zoom={14}
                      mapStyle={customMapStyle as any}
                      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || ''}
                      style={{width: '100%', height: '100%'}}
                      onClick={(e) => {
                        setProfile({
                          ...profile,
                          farmLatitude: e.lngLat.lat,
                          farmLongitude: e.lngLat.lng,
                        });
                      }}
                    >
                      {profile.farmLatitude && profile.farmLongitude && (
                        <Marker longitude={profile.farmLongitude} latitude={profile.farmLatitude} anchor="bottom">
                          <div className="text-orange-600 drop-shadow-lg">
                            <MapPin className="w-8 h-8 fill-white" />
                          </div>
                        </Marker>
                      )}
                    </MapBoxMap>
                    <div className="absolute top-2 left-0 right-0 flex justify-center z-10 pointer-events-none">
                      <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100 pointer-events-auto">
                        Pin Farm Location
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowSetupModal(false)}
              className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-sm"
            >
              Skip for now
            </button>
            <button
              onClick={handleSaveSetup}
              className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              {profile.userType === 'farmer' ? "Start Selling" : "Start Shopping"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Helper component for ShoppingCart since it's used in buyer role but not imported
const ShoppingCart = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

export default ProfilePage;
