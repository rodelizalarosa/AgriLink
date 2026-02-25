// Type Definitions

export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  seller: string;
  location: string;
  stock: number;
  image: string;
  category: string;
}

export interface DashboardCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
  trend?: string;
}

export interface ProductCardProps {
  product: Product;
}

export interface NavbarProps {
  currentPage: string;
  userType: string;
  setUserType: (type: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export interface SidebarProps {
  userType: string;
  setUserType: (type: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onLogout: () => void;
}

export interface LandingPageProps {
}

export interface FarmerDashboardProps {
}

export interface LoginPageProps {
  onLogin: (role: string) => void;
}


export interface RegisterPageProps {
}


export interface OrderItem {
  id: string;
  buyer?: string;
  farmer?: string;
  product: string;
  items?: string;
  qty?: string;
  date?: string;
  status: string;
  amount: string;
}

export interface FarmerApplication {
  name: string;
  location: string;
  products: string;
  date: string;
}

export interface UserData {
  name: string;
  type: string;
  location: string;
  status: string;
}

export interface FormData {
  name: string;
  category: string;
  price: string;
  quantity: string;
  unit: string;
  description: string;
  location: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'farmer' | 'buyer' | 'brgy_official' | 'lgu_official';
  agreeToTerms: boolean;
}


export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  userType?: string;
  agreeToTerms?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  userType: 'farmer' | 'buyer' | 'admin' | 'brgy_official' | 'lgu_official';
  profileImage?: string;
  bio?: string;
  // Farmer specific
  farmName?: string;
  farmSize?: string;
  deliveryRange?: string;
}