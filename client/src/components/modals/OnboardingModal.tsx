import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import MapBoxMap, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  Sprout,
  Heart
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { API_BASE_URL } from '../../api/apiConfig';
// Use a standard map style if custom one isn't available
const mapStyle = 'mapbox://styles/mapbox/streets-v11';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userType: string;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, userId, userName, userType, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const isFarmer = userType.toLowerCase() === 'farmer';

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    province: '',
    zip_code: '',
    latitude: 10.3157,
    longitude: 123.8854,
    interests: [] as string[],
    // Farm fields
    farm_address: '',
    farm_city: '',
    farm_province: '',
    farm_zip_code: '',
    farm_latitude: 10.3157,
    farm_longitude: 123.8854,
    farm_address_same_as_home: true
  });

  const [viewState, setViewState] = useState({
    longitude: 123.8854,
    latitude: 10.3157,
    zoom: 12
  });

  const [farmViewState, setFarmViewState] = useState({
    longitude: 123.8854,
    latitude: 10.3157,
    zoom: 12
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/onboarding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          zip_code: formData.zip_code,
          latitude: formData.latitude,
          longitude: formData.longitude,
          // Farm fields
          farm_address: formData.farm_address,
          farm_city: formData.farm_city,
          farm_province: formData.farm_province,
          farm_zip_code: formData.farm_zip_code,
          farm_latitude: formData.farm_latitude,
          farm_longitude: formData.farm_longitude,
          farm_address_same_as_home: formData.farm_address_same_as_home
        })
      });

      if (!response.ok) throw new Error('Failed to update onboarding info');

      localStorage.setItem('agrilink_onboarding_completed', '1');
      toast.success('Onboarding completed! Welcome to AgriLink!');
      onComplete();
      onClose();
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🌍 Auto-Geocode Home Address
  useEffect(() => {
    if (step !== 3 || !formData.address || formData.address.length < 3) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const query = encodeURIComponent(`${formData.address}, ${formData.city}, ${formData.province}, Philippines`);
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) return;

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&limit=1&country=ph`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
          setViewState(prev => ({ ...prev, latitude: lat, longitude: lng, zoom: 15 }));
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.address, formData.city, formData.province, step]);

  // 🚜 Auto-Geocode Farm Address
  useEffect(() => {
    // Only geocode if the user is a farmer AND we're on the new "Farm Info" step (Step 4 for farmers)
    if (!isFarmer || step !== 4 || formData.farm_address_same_as_home || !formData.farm_address || formData.farm_address.length < 3) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const query = encodeURIComponent(`${formData.farm_address}, ${formData.farm_city}, ${formData.farm_province}, Philippines`);
        const token = import.meta.env.VITE_MAPBOX_TOKEN;
        if (!token) return;

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&limit=1&country=ph`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setFormData(prev => ({ ...prev, farm_latitude: lat, farm_longitude: lng }));
          setFarmViewState(prev => ({ ...prev, latitude: lat, longitude: lng, zoom: 15 }));
        }
      } catch (error) {
        console.error('Farm geocoding error:', error);
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.farm_address, formData.farm_city, formData.farm_province, step, isFarmer]);

  const buyerSteps = [
    { title: 'Welcome', icon: <User className="w-6 h-6" /> },
    { title: 'Contact', icon: <Phone className="w-6 h-6" /> },
    { title: 'Location', icon: <MapPin className="w-6 h-6" /> },
    { title: 'Interests', icon: <Heart className="w-6 h-6" /> },
    { title: 'Ready!', icon: <CheckCircle className="w-6 h-6" /> }
  ];

  const farmerSteps = [
    { title: 'Welcome', icon: <User className="w-6 h-6" /> },
    { title: 'Personal', icon: <Phone className="w-6 h-6" /> },
    { title: 'Home', icon: <MapPin className="w-6 h-6" /> },
    { title: 'Farm Settings', icon: <Sprout className="w-6 h-6" /> },
    { title: 'Specialties', icon: <Heart className="w-6 h-6" /> },
    { title: 'Finalize', icon: <CheckCircle className="w-6 h-6" /> }
  ];

  const steps = isFarmer ? farmerSteps : buyerSteps;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Disable closing by clicking outside
      title=""
      size="3xl"
    >
      <div className="py-4">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#5ba409] -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  step > i + 1 ? 'bg-green-600 text-white' : 
                  step === i + 1 ? 'bg-green-600 text-white ring-4 ring-green-100' : 
                  'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {step > i + 1 ? <CheckCircle className="w-6 h-6" /> : s.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${
                step >= i + 1 ? 'text-green-600' : 'text-gray-400'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[350px]">
          {step === 1 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sprout className="w-12 h-12 text-[#5ba409]" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight">
                Mabuhay, {userName}! 🌱
              </h2>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {isFarmer 
                  ? "Welcome to the AgriLink Merchant Portal. Let's get your farm profile ready so you can start listing your products."
                  : "Welcome to AgriLink. We're excited to have you join our community connecting local buyers and farmers."}
              </p>
              <div className="bg-[#F9FBE7] p-6 rounded-3xl border border-green-100">
                <p className="text-green-600 font-bold">
                  {isFarmer
                    ? "Let's take 3 minutes to set up your producer profile and farm location."
                    : "Let's take 2 minutes to set up your profile so you can start shopping for fresh, sustainable produce."}
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900">
                  {isFarmer ? "Personal Contact Details" : "Contact Information"}
                </h2>
                <p className="text-gray-500">
                  {isFarmer ? "Provide your personal contact info and home location base." : "How can farmers and delivery partners reach you?"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="+63 9XX XXX XXXX"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="6000"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    placeholder="Cebu City"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Province</label>
                  <input
                    type="text"
                    placeholder="Cebu"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-4">
                <h2 className="text-2xl font-black text-gray-900">
                  {isFarmer ? "Home Base Location" : "Delivery Address & Pin"}
                </h2>
                <p className="text-gray-500">
                  {isFarmer ? "Where are you based? You can pin your farm, home, or a nearby landmark for easier meetups." : "Pin your exact location or a nearby landmark for easier meetups and delivery coordination."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                  <textarea
                    placeholder="Exact address (e.g., Unit 123, Street Name, Barangay)"
                    rows={2}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="w-full h-[250px] rounded-3xl overflow-hidden border-2 border-gray-100 relative group">
                  <MapBoxMap
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle={mapStyle}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || ''}
                    style={{width: '100%', height: '100%'}}
                    onClick={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        latitude: e.lngLat.lat,
                        longitude: e.lngLat.lng,
                      }));
                    }}
                  >
                    <Marker longitude={formData.longitude} latitude={formData.latitude} anchor="bottom">
                      <div className="text-[#5ba409] drop-shadow-lg">
                        <MapPin className="w-8 h-8 fill-white" />
                      </div>
                    </Marker>
                  </MapBoxMap>
                  <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg text-[10px] font-black text-[#5ba409] uppercase tracking-widest border border-green-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Click on map to set your location</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isFarmer && step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-4">
                <h2 className="text-2xl font-black text-gray-900">Farm Setup</h2>
                <p className="text-gray-500">Tell us where your farm is located.</p>
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border-2 border-green-100 cursor-pointer transition-all hover:bg-green-100/50 group">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    formData.farm_address_same_as_home ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'
                  }`}>
                    {formData.farm_address_same_as_home && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.farm_address_same_as_home}
                    onChange={(e) => setFormData({ ...formData, farm_address_same_as_home: e.target.checked })}
                  />
                  <span className="font-black text-xs uppercase tracking-widest text-[#5ba409]">Farm is at the same location as my home</span>
                </label>

                {!formData.farm_address_same_as_home && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Farm City</label>
                        <input
                          type="text"
                          placeholder="e.g. Minglanilla"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-xl outline-none font-bold transition-all text-sm"
                          value={formData.farm_city}
                          onChange={(e) => setFormData({ ...formData, farm_city: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Farm Province</label>
                        <input
                          type="text"
                          placeholder="e.g. Cebu"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-xl outline-none font-bold transition-all text-sm"
                          value={formData.farm_province}
                          onChange={(e) => setFormData({ ...formData, farm_province: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                      <textarea
                        placeholder="Farm Street Address"
                        rows={2}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#5ba409] rounded-2xl outline-none font-bold transition-all resize-none text-sm"
                        value={formData.farm_address}
                        onChange={(e) => setFormData({ ...formData, farm_address: e.target.value })}
                      />
                    </div>

                    <div className="w-full h-[200px] rounded-3xl overflow-hidden border-2 border-gray-100 relative group">
                      <MapBoxMap
                        {...farmViewState}
                        onMove={evt => setFarmViewState(evt.viewState)}
                        mapStyle={mapStyle}
                        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN || ''}
                        style={{width: '100%', height: '100%'}}
                        onClick={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            farm_latitude: e.lngLat.lat,
                            farm_longitude: e.lngLat.lng,
                          }));
                        }}
                      >
                        <Marker longitude={formData.farm_longitude} latitude={formData.farm_latitude} anchor="bottom">
                          <div className="text-orange-600 drop-shadow-lg">
                            <MapPin className="w-8 h-8 fill-white" />
                          </div>
                        </Marker>
                      </MapBoxMap>
                      <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Click to set Farm Location</span>
                      </div>
                    </div>
                  </div>
                )}

                {formData.farm_address_same_as_home && (
                  <div className="p-8 bg-green-50/50 border-2 border-dashed border-green-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 uppercase italic tracking-tighter">Using Home Location</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed mt-1">
                        Your farm coordinates will mirror your home base pin.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {((!isFarmer && step === 4) || (isFarmer && step === 5)) && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900">
                  {isFarmer ? "I specialize in..." : "I'm interested in..."}
                </h2>
                <p className="text-gray-500">
                  {isFarmer ? "Select the primary categories of crops you produce." : "Select at least 3 categories for personalized recommendations."}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Vegetables', icon: '🥦' },
                  { name: 'Fruits', icon: '🍎' },
                  { name: 'Leafy Greens', icon: '🥬' },
                  { name: 'Root Crops', icon: '🥔' },
                  { name: 'Organic Rice', icon: '🌾' },
                  { name: 'Fresh Spices', icon: '🌶️' },
                  { name: 'Herbs', icon: '🌿' },
                  { name: 'Dairy Eggs', icon: '🥚' },
                  { name: 'Seasonal', icon: '🌅' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => toggleInterest(item.name)}
                    className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 group ${
                      formData.interests.includes(item.name)
                        ? 'border-green-600 bg-green-50 scale-105'
                        : 'border-gray-100 bg-white hover:border-green-600 hover:bg-green-50/50'
                    }`}
                  >
                    <span className="text-3xl group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className={`text-sm font-bold ${
                      formData.interests.includes(item.name) ? 'text-[#5ba409]' : 'text-gray-600'
                    }`}>
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {((!isFarmer && step === 5) || (isFarmer && step === 6)) && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  {isFarmer ? <Sprout className="w-12 h-12 text-[#5ba409]" /> : <ShoppingBag className="w-12 h-12 text-[#5ba409]" />}
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-lg animate-bounce">
                  <StarIcon className="w-6 h-6 fill-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">You're All Set!</h2>
                <p className="text-gray-600 text-lg">
                  {isFarmer 
                    ? "Your farm profile is complete. You can now start listing your harvests for buyers to see."
                    : "Everything is ready. You can now explore the marketplace and support our local farmers."}
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-green-200 mt-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sprout className="w-24 h-24" />
                </div>
                <h3 className="text-[#5ba409] font-black uppercase tracking-widest text-xs mb-4">
                  {isFarmer ? "Merchant Passport" : "Profile Summary"}
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-bold">{formData.phone || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="font-bold truncate">
                      {isFarmer 
                        ? (formData.farm_address_same_as_home ? 'Farm at Home Base' : formData.farm_address)
                        : (formData.address || 'Address not pinned')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.interests.map(i => (
                      <span key={i} className="bg-green-50 text-[#5ba409] text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-full border border-green-200">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 mt-12 bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100 backdrop-blur-sm">
          {step > 1 && step < steps.length && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex-1 py-4 bg-white text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2 border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          
          {step < steps.length ? (
            <button
              onClick={handleNext}
              className="flex-2 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-2 py-4 bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {loading ? 'Setting things up...' : (isFarmer ? 'Go to Farmer Dashboard' : 'Enter Marketplace')} 
              {!loading && (isFarmer ? <Sprout className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />)}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default OnboardingModal;
