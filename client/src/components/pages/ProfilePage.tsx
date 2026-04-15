import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Camera,
  Clock,
  Globe2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Trash2,
  SlidersHorizontal,
  User as UserIcon,
  Heart,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL, getFullImageUrl } from '../../api/apiConfig';
import { useToast } from '../ui/Toast';
import LogoutConfirmationModal from '../ui/LogoutConfirmationModal';
import ReviewModal from '../modals/ReviewModal';
import ProductCard from '../ui/ProductCard';
import type { UserProfile, Product } from '../../types';

type OrderRow = {
  req_id: number;
  product_id?: number | string;
  req_status: string;
  req_date?: string;
  created_at?: string;
  quantity: number;
  p_name?: string;
  p_price?: number;
  p_image?: string;
  p_id?: number | string;
  farmer_first?: string;
  farmer_last?: string;
  buyer_first?: string;
  buyer_last?: string;
};

const statusClasses: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  canceled: 'bg-rose-100 text-rose-700 border-rose-200',
};

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

const sectionClass =
  'rounded-2xl border border-slate-200 bg-white shadow-sm';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, ariaLabel }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? 'bg-emerald-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

const parseMaybeNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [activeSection, setActiveSection] = useState(() => {
    const tab = (searchParams.get('tab') || 'info').toLowerCase();
    return tab === 'farm' ? 'info' : tab;
  });
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [farmImageUploading, setFarmImageUploading] = useState(false);
  const [alertsSaving, setAlertsSaving] = useState(false);
  const [removingOrderId, setRemovingOrderId] = useState<number | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<OrderRow | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const token = localStorage.getItem('agrilink_token');
  const userId = localStorage.getItem('agrilink_id') || localStorage.getItem('agrilink_userId');
  const storedRole = (
    localStorage.getItem('agrilink_role') ||
    localStorage.getItem('agrilink_userType') ||
    'buyer'
  ).toLowerCase();

  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    userType: 'buyer',
    bio: '',
    farmImage: '',
    farmAddressSameAsHome: true,
  });

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSort, setOrderSort] = useState<'latest' | 'oldest'>('latest');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    orders: true,
    messages: true,
  });
  const [appSettings, setAppSettings] = useState({
    language: 'en-PH',
    compactOrders: false,
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  const isFarmer = (profile.userType || storedRole) === 'farmer';

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`profile_alerts_${userId}`);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setNotificationSettings((prev) => ({
        ...prev,
        orders: !!parsed.orders,
        messages: !!parsed.messages,
      }));
    } catch {
      // ignore malformed local settings
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem(`profile_settings_${userId}`);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setAppSettings((prev) => ({
        ...prev,
        language: String(parsed.language || prev.language),
        compactOrders: !!parsed.compactOrders,
      }));
    } catch {
      // ignore malformed local settings
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || !userId) {
          navigate('/login');
          return;
        }

        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/purchases/${storedRole === 'farmer' ? 'farmer' : 'buyer'}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          const fallbackFirstName = localStorage.getItem('agrilink_firstName') || '';
          const fallbackLastName = localStorage.getItem('agrilink_lastName') || '';
          setProfile({
            id: String(data.id || ''),
            firstName: data.first_name || fallbackFirstName,
            lastName: data.last_name || fallbackLastName,
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            province: data.province || '',
            zipCode: data.zip_code || '',
            latitude: parseMaybeNumber(data.latitude),
            longitude: parseMaybeNumber(data.longitude),
            userType: (data.role || storedRole || 'buyer') as UserProfile['userType'],
            bio: data.bio || '',
            profileImage: data.profile_image || data.image_path || '',
            farmName: data.farm_name || '',
            farmAddress: data.farm_address || '',
            farmCity: data.farm_city || '',
            farmProvince: data.farm_province || '',
            farmZipCode: data.farm_zip_code || '',
            farmLatitude: parseMaybeNumber(data.farm_latitude),
            farmLongitude: parseMaybeNumber(data.farm_longitude),
            farmAddressSameAsHome: data.farm_address_same_as_home !== 0,
            farmImage: data.farm_image || '',
          });
        } else {
          toast.error('Failed to load profile data.');
        }

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOrders(Array.isArray(data.orders) ? data.orders : []);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Unable to load profile at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, storedRole, token, userId, toast]);

  useEffect(() => {
    if (activeSection === 'market' && !isFarmer) {
      fetchWishlist();
    }
  }, [activeSection, isFarmer]);

  const fetchWishlist = async () => {
    if (!token) return;
    setWishlistLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const raw = Array.isArray(data.favorites) ? data.favorites : [];
        const mapped: Product[] = raw.map((p: any) => ({
          id: p.p_id || p.product_id,
          name: p.p_name || 'Unnamed Product',
          price: parseFloat(p.p_price) || 0,
          unit: p.p_unit || 'unit',
          seller: p.seller_first_name ? `${p.seller_first_name} ${p.seller_last_name || ''}` : 'Local Farm',
          location: p.seller_city || 'Local Farm',
          stock: parseFloat(p.p_quantity) || 0,
          image: p.p_image || '',
          category: p.cat_name || 'Others',
          sellerUserId: Number(p.sellerUserId || 0),
        }));
        setWishlist(mapped);
      }
    } catch {
      console.error('Failed to fetch wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const toggleFavorite = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      toast.info('Please sign in.');
      return;
    }
    const isFav = wishlist.some((p) => Number(p.id) === productId);
    try {
      const method = isFav ? 'DELETE' : 'POST';
      const url = isFav ? `${API_BASE_URL}/favorites/${productId}` : `${API_BASE_URL}/favorites`;
      const body = isFav ? undefined : JSON.stringify({ productId });

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (res.ok) {
        if (isFav) {
          setWishlist((prev) => prev.filter((p) => Number(p.id) !== productId));
        } else {
          fetchWishlist();
        }
      }
    } catch {
      toast.error('Failed to update wishlist.');
    }
  };

  const handleOpenReview = (order: OrderRow) => {
    setSelectedOrderForReview(order);
    setIsReviewModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('agrilink_role');
    localStorage.removeItem('agrilink_isLoggedIn');
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_id');
    localStorage.removeItem('agrilink_firstName');
    localStorage.removeItem('agrilink_lastName');
    localStorage.removeItem('agrilink_onboarding_completed');
    localStorage.removeItem('agrilink_userId');
    window.dispatchEvent(new Event('agrilink-auth-changed'));
    navigate('/login');
  };

  const orderStatuses = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => set.add((o.req_status || 'Unknown').trim()));
    return ['all', ...Array.from(set)];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const base = orders.filter((order) => {
      if (orderStatusFilter === 'all') return true;
      return (order.req_status || '').toLowerCase() === orderStatusFilter.toLowerCase();
    });

    return [...base].sort((a, b) => {
      const aTime = new Date(a.req_date || a.created_at || 0).getTime();
      const bTime = new Date(b.req_date || b.created_at || 0).getTime();
      return orderSort === 'latest' ? bTime - aTime : aTime - bTime;
    });
  }, [orders, orderStatusFilter, orderSort]);

  const buildProfilePayload = () => ({
    first_name: profile.firstName,
    last_name: profile.lastName,
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    province: profile.province,
    zip_code: profile.zipCode,
    latitude: profile.latitude,
    longitude: profile.longitude,
    bio: profile.bio,
    farm_name: profile.farmName,
    farm_address: profile.farmAddress,
    farm_city: profile.farmCity,
    farm_province: profile.farmProvince,
    farm_zip_code: profile.farmZipCode,
    farm_latitude: profile.farmLatitude,
    farm_longitude: profile.farmLongitude,
    farm_address_same_as_home: profile.farmAddressSameAsHome,
  });

  const handleSaveProfile = async () => {
    if (!token || !userId) {
      toast.error('Session expired. Please sign in again.');
      navigate('/login');
      return;
    }

    setSaveLoading(true);
    try {
      const form = new FormData();
      const payload = buildProfilePayload() as Record<string, unknown>;
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          form.append(key, '');
        } else {
          form.append(key, String(value));
        }
      });

      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || 'Failed to save profile.');
        return;
      }

      localStorage.setItem('agrilink_firstName', profile.firstName || '');
      localStorage.setItem('agrilink_lastName', profile.lastName || '');
      toast.success('Profile updated successfully.');
    } catch {
      toast.error('Network error while saving profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveAlerts = async () => {
    if (!userId) return;
    setAlertsSaving(true);
    try {
      localStorage.setItem(`profile_alerts_${userId}`, JSON.stringify(notificationSettings));
      toast.success('Alert preferences saved.');
    } catch {
      toast.error('Unable to save alert preferences.');
    } finally {
      setAlertsSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!userId) return;
    setSettingsSaving(true);
    try {
      localStorage.setItem(`profile_settings_${userId}`, JSON.stringify(appSettings));
      toast.success('Settings saved.');
    } catch {
      toast.error('Unable to save settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords must match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || 'Error updating password.');
        return;
      }

      toast.success('Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('Network error while updating password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    if (!token || !userId) {
      toast.error('Session expired. Please sign in again.');
      navigate('/login');
      return;
    }

    setProfileImageUploading(true);
    try {
      const form = new FormData();
      form.append('profile_image', file);

      const payload = buildProfilePayload() as Record<string, unknown>;
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          form.append(key, '');
        } else {
          form.append(key, String(value));
        }
      });

      const res = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || 'Failed to upload profile image.');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setProfile((prev) => ({
        ...prev,
        profileImage: data?.profile_image || URL.createObjectURL(file),
      }));
      toast.success('Profile image updated.');
    } catch {
      toast.error('Failed to upload profile image.');
    } finally {
      setProfileImageUploading(false);
    }
  };

  const handleFarmImageUpload = async (file: File) => {
    if (!token || !userId) {
      toast.error('Session expired. Please sign in again.');
      navigate('/login');
      return;
    }

    setFarmImageUploading(true);
    try {
      const form = new FormData();
      form.append('farm_image', file);

      const payload = buildProfilePayload() as Record<string, unknown>;
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          form.append(key, '');
        } else {
          form.append(key, String(value));
        }
      });

      const res = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        toast.error('Failed to upload farm image.');
        return;
      }

      const data = await res.json();
      setProfile((prev) => ({
        ...prev,
        farmImage: data?.farm_image || URL.createObjectURL(file),
      }));
      toast.success('Background image updated.');
    } catch {
      toast.error('Failed to upload farm image.');
    } finally {
      setFarmImageUploading(false);
    }
  };

  const handleRemoveCancelledOrder = async (reqId: number) => {
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      navigate('/login');
      return;
    }

    setRemovingOrderId(reqId);
    try {
      const response = await fetch(`${API_BASE_URL}/purchases/cancelled/${reqId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || 'Unable to remove cancelled order.');
        return;
      }

      setOrders((prev) => prev.filter((order) => order.req_id !== reqId));
      toast.success('Cancelled order removed.');
    } catch {
      toast.error('Network error while removing cancelled order.');
    } finally {
      setRemovingOrderId(null);
    }
  };

  const heroStyle: React.CSSProperties =
    isFarmer && profile.farmImage
      ? {
          backgroundImage: `linear-gradient(120deg, rgba(15, 23, 42, 0.72), rgba(22, 101, 52, 0.62)), url(${getFullImageUrl(profile.farmImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : isFarmer
        ? {
            background:
              'linear-gradient(135deg, #0f172a 0%, #14532d 52%, #166534 100%)',
          }
        : {
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e293b 56%, #334155 100%)',
          };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 pt-20 flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <section
          className="relative overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm"
          style={heroStyle}
        >
          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex items-end gap-4">
                <label className="relative h-24 w-24 rounded-2xl border-4 border-white/90 bg-white/95 shadow-xl overflow-hidden grid place-items-center cursor-pointer">
                  {profile.profileImage ? (
                    <img src={getFullImageUrl(profile.profileImage)} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-slate-400" />
                  )}
                  <span className="absolute bottom-1 right-1 grid h-7 w-7 place-items-center rounded-full border border-white/75 bg-slate-900/80 text-white">
                    <Camera size={12} />
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={profileImageUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProfileImageUpload(file);
                      e.currentTarget.value = '';
                    }}
                  />
                </label>

                <div className="text-white pb-1">
                  <h1 className="text-2xl md:text-3xl font-bold capitalize">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/82">
                    {isFarmer
                      ? 'Manage your storefront identity, contact details, farm presentation, and order activity in one place.'
                      : 'Keep your buyer profile polished, your account secure, and your wishlist items ready for harvest.'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 uppercase tracking-wide">
                      {profile.userType}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1">
                      <MapPin size={12} />
                      {[profile.city, profile.province].filter(Boolean).join(', ') || 'Location not set'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                <label className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white cursor-pointer hover:bg-black/45 transition">
                  <Camera size={15} />
                  {profileImageUploading ? 'Uploading...' : 'Change Profile Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={profileImageUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProfileImageUpload(file);
                      e.currentTarget.value = '';
                    }}
                  />
                </label>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saveLoading ? 'Updating...' : 'Update Profile'}
                </button>
                {isFarmer && (
                  <label className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white cursor-pointer hover:bg-black/45 transition">
                    <Camera size={15} />
                    {farmImageUploading ? 'Uploading...' : 'Change Farm Background'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={farmImageUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFarmImageUpload(file);
                        e.currentTarget.value = '';
                      }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 gap-5 md:items-start md:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:sticky md:top-24">
            <div className="space-y-2">
              {[
                { id: 'info', label: 'My Profile', icon: UserIcon },
                ...(!isFarmer ? [{ id: 'market', label: 'Wishlist', icon: Heart }] : []),
                { id: 'history', label: 'Orders', icon: Clock },
                { id: 'password', label: 'Security', icon: Lock },
                { id: 'alerts', label: 'Notifications', icon: Bell },
                { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    activeSection === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>

          <main className="space-y-5">
            {activeSection === 'info' && (
              <section className={sectionClass}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">My Info</h2>
                    <p className="text-sm text-slate-500">Manage your personal and contact details.</p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {saveLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">First Name</span>
                    <input className={inputClass} value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Last Name</span>
                    <input className={inputClass} value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Email</span>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input className={`${inputClass} pl-9 bg-slate-50 text-slate-600`} readOnly value={profile.email} />
                    </div>
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Phone</span>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input className={`${inputClass} pl-9`} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                    </div>
                  </label>

                  <label className="space-y-1 md:col-span-2">
                    <span className="text-xs font-medium text-slate-500">Home Address</span>
                    <input className={inputClass} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">City</span>
                    <input className={inputClass} value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Province</span>
                    <input className={inputClass} value={profile.province} onChange={(e) => setProfile({ ...profile, province: e.target.value })} />
                  </label>
                  <label className="space-y-1 md:max-w-[240px]">
                    <span className="text-xs font-medium text-slate-500">ZIP Code</span>
                    <input className={inputClass} value={profile.zipCode} onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })} />
                  </label>

                  <label className="space-y-1 md:col-span-2">
                    <span className="text-xs font-medium text-slate-500">Bio</span>
                    <textarea
                      rows={4}
                      className={inputClass}
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell buyers and the community about you..."
                    />
                  </label>
                </div>
              </section>
            )}

            {activeSection === 'market' && !isFarmer && (
              <section className={sectionClass}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Wishlist</h2>
                    <p className="text-sm text-slate-500">Your saved products for future harvests.</p>
                  </div>
                  <button
                    onClick={() => navigate('/buyer/marketplace')}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ShoppingCart size={15} />
                    Explore Market
                  </button>
                </div>

                <div className="p-6">
                  {wishlistLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <div className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                      <p className="text-xs text-slate-400 font-medium">Updating Wishlist...</p>
                    </div>
                  ) : wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                        <Heart size={32} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
                      <p className="text-sm text-slate-500 mt-1 max-w-[240px]">Save some products to see them here later!</p>
                      <button
                        onClick={() => navigate('/buyer/marketplace')}
                        className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
                      >
                        Shop Now
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                      {wishlist.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorited={true}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === 'password' && (
              <section className={`${sectionClass} space-y-4 p-6`}>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
                  <p className="text-sm text-slate-500">Use a strong password with at least 8 characters.</p>
                </div>
                <input className={inputClass} type="password" placeholder="Current password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
                <input className={inputClass} type="password" placeholder="New password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                <input className={inputClass} type="password" placeholder="Confirm new password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                <button onClick={handleUpdatePassword} disabled={passwordLoading} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </section>
            )}

            {activeSection === 'alerts' && (
              <section className={`${sectionClass} space-y-4 p-6`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Alerts</h2>
                    <p className="text-sm text-slate-500">Choose your notification preferences.</p>
                  </div>
                  <button onClick={handleSaveAlerts} disabled={alertsSaving} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                    {alertsSaving ? 'Saving...' : 'Save Alerts'}
                  </button>
                </div>

                {[
                  { id: 'orders', label: isFarmer ? 'New Orders' : 'Order Approved', desc: isFarmer ? 'Alert me when someone places an order.' : 'Alert me when a farmer approves my order.' },
                  { id: 'messages', label: 'Messages', desc: 'Alert me when I receive a new message.' },
                ].map((item) => (
                  <label key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <ToggleSwitch
                      checked={(notificationSettings as Record<string, boolean>)[item.id]}
                      onChange={(next) => setNotificationSettings((prev) => ({ ...prev, [item.id]: next }))}
                      ariaLabel={`${item.label} toggle`}
                    />
                  </label>
                ))}
              </section>
            )}

            {activeSection === 'info' && isFarmer && (
              <section className={sectionClass}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">My Farm</h2>
                    <p className="text-sm text-slate-500">Manage your farm details and banner image.</p>
                  </div>
                  <button onClick={handleSaveProfile} disabled={saveLoading} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                    {saveLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 rounded-xl border border-dashed border-slate-300 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="h-20 w-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                      {profile.farmImage ? (
                        <img src={getFullImageUrl(profile.farmImage)} alt="Farm" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-slate-400">No image</div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">Farm Banner</p>
                      <p className="text-xs text-slate-500 mb-2">Upload a farm image shown on your profile header.</p>
                      <label className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-slate-800">
                        <Camera size={14} />
                        {farmImageUploading ? 'Uploading...' : 'Upload Farm Image'}
                        <input type="file" accept="image/*" className="hidden" disabled={farmImageUploading} onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFarmImageUpload(file); e.currentTarget.value = ''; }} />
                      </label>
                    </div>
                  </div>

                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Farm Name</span>
                    <input className={inputClass} value={profile.farmName || ''} onChange={(e) => setProfile({ ...profile, farmName: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Farm Address</span>
                    <input className={inputClass} value={profile.farmAddress || ''} onChange={(e) => setProfile({ ...profile, farmAddress: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Farm City</span>
                    <input className={inputClass} value={profile.farmCity || ''} onChange={(e) => setProfile({ ...profile, farmCity: e.target.value })} />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">Farm Province</span>
                    <input className={inputClass} value={profile.farmProvince || ''} onChange={(e) => setProfile({ ...profile, farmProvince: e.target.value })} />
                  </label>
                  <label className="space-y-1 md:max-w-[240px]">
                    <span className="text-xs font-medium text-slate-500">Farm ZIP Code</span>
                    <input className={inputClass} value={profile.farmZipCode || ''} onChange={(e) => setProfile({ ...profile, farmZipCode: e.target.value })} />
                  </label>

                  <div className="md:col-span-2 mt-1 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700">Use home address as farm address</p>
                    <ToggleSwitch
                      checked={profile.farmAddressSameAsHome ?? true}
                      onChange={(next) => setProfile({ ...profile, farmAddressSameAsHome: next })}
                      ariaLabel="Use home address for farm"
                    />
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'history' && (
              <section className={sectionClass}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Order History</h2>
                    <p className="text-sm text-slate-500">All orders with product images and counterpart details.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</option>
                      ))}
                    </select>
                    <select value={orderSort} onChange={(e) => setOrderSort(e.target.value as 'latest' | 'oldest')} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No orders found for the selected filters.</div>
                  ) : (
                    filteredOrders.map((order) => {
                      const status = (order.req_status || 'Unknown').toLowerCase();
                      const isCancelledStatus = status.includes('cancel');
                      const badgeClass = statusClasses[status] || 'bg-slate-100 text-slate-700 border-slate-200';
                      const counterpart = isFarmer
                        ? `${order.buyer_first || ''} ${order.buyer_last || ''}`.trim() || 'Buyer'
                        : `${order.farmer_first || ''} ${order.farmer_last || ''}`.trim() || 'Farmer';
                      const dateText = new Date(order.req_date || order.created_at || '').toLocaleDateString();
                      const amount = Number(order.quantity || 0) * Number(order.p_price || 0);

                      return (
                        <article
                          key={order.req_id}
                          className={`rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center ${appSettings.compactOrders ? 'p-3 gap-3' : 'p-4 gap-4'}`}
                        >
                          <div className="h-16 w-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            {order.p_image ? (
                              <img src={getFullImageUrl(order.p_image)} alt={order.p_name || 'Product'} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full grid place-items-center text-[10px] text-slate-400">No image</div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{order.p_name || 'Untitled Product'}</p>
                            <p className="text-xs text-slate-500">Order #{order.req_id} - {dateText}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {isFarmer ? 'Buyer' : 'Farmer'}: <span className="font-medium text-slate-700">{counterpart}</span>
                            </p>
                          </div>

                          <div className="md:text-right space-y-1">
                            <p className="text-sm font-semibold text-slate-900">PHP {amount.toLocaleString()}</p>
                            <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-medium capitalize ${badgeClass}`}>
                              {order.req_status}
                            </span>
                            {isCancelledStatus && (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCancelledOrder(order.req_id)}
                                  disabled={removingOrderId === order.req_id}
                                  className="mt-2 inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-60"
                                  aria-label={`Remove cancelled order ${order.req_id}`}
                                >
                                  <Trash2 size={12} />
                                  {removingOrderId === order.req_id ? 'Removing...' : 'Remove'}
                                </button>
                              </div>
                            )}

                            {!isFarmer && status === 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleOpenReview(order)}
                                className="mt-2 inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600 hover:bg-amber-100"
                              >
                                <Star size={12} className="fill-amber-600" />
                                Review Product
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            )}
            {activeSection === 'settings' && (
              <section className={`${sectionClass} p-6`}>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Platform Settings</h2>
                    <p className="text-sm text-slate-500">Configure your global account preferences.</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <Globe2 size={18} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">Language & Region</h3>
                    <p className="mb-3 text-xs text-slate-500">Set your preferred language and regional formats.</p>
                    <select
                      className={inputClass}
                      value={appSettings.language}
                      onChange={(e) => setAppSettings((prev) => ({ ...prev, language: e.target.value }))}
                    >
                      <option value="en-PH">English (Philippines)</option>
                      <option value="fil-PH">Filipino</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Compact Order View</h3>
                        <p className="text-xs text-slate-500">Reduce spacing in your Orders list for faster scanning.</p>
                      </div>
                      <ToggleSwitch
                        checked={appSettings.compactOrders}
                        onChange={(next) => setAppSettings((prev) => ({ ...prev, compactOrders: next }))}
                        ariaLabel="Compact order view toggle"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={settingsSaving}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {settingsSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        order={selectedOrderForReview}
        onSuccess={() => {
          // You could refetch reviews if we had a dedicated tab
        }}
      />
    </div>
  );
};

export default ProfilePage;


