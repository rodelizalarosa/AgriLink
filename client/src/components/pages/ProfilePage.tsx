import React, { useState } from 'react';
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
  Sprout
} from 'lucide-react';
import type { UserProfile } from '../../types';

interface ProfilePageProps {
  userType: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userType }) => {
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
    userType: userType as 'farmer' | 'buyer' | 'admin',
    bio: 'Passionate about sustainable farming and bringing fresh produce directly to our community.',
    profileImage: '/mongg.jpg',
    farmName: userType === 'farmer' ? 'Green Valley Organic Farm' : undefined,
    farmSize: userType === 'farmer' ? '5 Hectares' : undefined,
    deliveryRange: userType === 'farmer' ? '25km' : undefined,
  });

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
        if (userType === 'farmer') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Sprout className="w-6 h-6 mr-2 text-[#5ba409]" />
                Farm Information
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
                <h4 className="font-bold text-gray-900 mb-3">Primary Produce</h4>
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
              </div>
            </div>
          );
        } else if (userType === 'buyer') {
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-[#5ba409]" />
                Buyer Preferences
              </h3>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#5ba409]">
                  <Sprout className="w-8 h-8 text-[#5ba409]" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Sustainable Shopper</h4>
                <p className="text-gray-600 text-sm">You have supported 12 local farmers and saved 45kg of CO2 this month!</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Favorite Categories</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['Organic Vegetables', 'Fresh Fruits', 'Dairy & Eggs', 'Local Grains'].map(cat => (
                    <div key={cat} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-4 h-4 rounded bg-[#5ba409]"></div>
                      <span className="font-medium text-gray-700">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                    <h1 className="text-3xl font-black text-gray-900">{profile.firstName} {profile.lastName}</h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-green-100 text-[#5ba409] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        {profile.userType}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.city}, {profile.province}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {!isEditing ? (
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
              
              {profile.userType !== 'admin' && (
                <button
                  onClick={() => setActiveTab('role')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'role' 
                      ? 'bg-white text-[#5ba409] shadow-md scale-[1.02]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {profile.userType === 'farmer' ? <Sprout className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  <span>{profile.userType === 'farmer' ? 'Farm Details' : 'Preferences'}</span>
                </button>
              )}

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
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
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
