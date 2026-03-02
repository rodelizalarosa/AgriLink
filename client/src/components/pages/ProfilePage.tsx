import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import Modal from '../ui/Modal';
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
  CheckCircle
} from 'lucide-react';
import { sampleProducts } from '../../data';
import type { UserProfile } from '../../types';

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

  useEffect(() => {
    if (isNewUser) {
      setShowSetupModal(true);
    }
  }, [isNewUser]);

  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'role'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data based on role
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'James Robert',
    lastName: 'Cabizares',
    email: userType === 'admin' ? 'admin@agrilink.ph' : 'juan.delacruz@email.com',
    phone: '+63 912 345 6789',
    address: '123 Harvest Lane',
    city: 'Malaybalay',
    province: 'Bukidnon',
    zipCode: '8700',
    userType: userType as 'farmer' | 'buyer' | 'admin' | 'brgy_official' | 'lgu_official',
    bio: 'Dedicated to connecting farmers and modernizing agricultural management in our local community.',
    profileImage: '/mongg.jpg',
    farmName: (userType === 'farmer' || isReadOnly) ? 'Green Valley Organic Farm' : undefined,
    farmSize: (userType === 'farmer' || isReadOnly) ? '5 Hectares' : undefined,
    deliveryRange: (userType === 'farmer' || isReadOnly) ? '25km' : undefined,
  });

  // If reading only, override type to farmer (for demo purposes)
  const effectiveUserType = isReadOnly ? 'farmer' : userType;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would be an API call
    alert('Profile updated successfully! 🌿');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                Address Information
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
              
              {effectiveUserType !== 'admin' && (
                <button
                  onClick={() => setActiveTab('role')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'role' 
                      ? 'bg-white text-[#5ba409] shadow-md scale-[1.02]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {effectiveUserType === 'farmer' ? <Sprout className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  <span>{effectiveUserType === 'farmer' ? 'Farm Details' : 'Order History'}</span>
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
      >
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-3xl border border-green-100 mb-6">
            <h3 className="text-xl font-black text-green-900 mb-2">Almost there!</h3>
            <p className="text-green-800/70 text-sm font-medium">
              To start buying fresh produce, we just need a few more details to help with delivery and coordination.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  placeholder="Street Name, Barangay, City, Province"
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all resize-none"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowSetupModal(false)}
              className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Skip for now
            </button>
            <button
              onClick={() => {
                setShowSetupModal(false);
                navigate('/marketplace');
              }}
              className="flex-[2] py-4 bg-[#5ba409] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
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
