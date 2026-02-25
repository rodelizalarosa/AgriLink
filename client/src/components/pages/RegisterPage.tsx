import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle, ShoppingCart, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormData } from '../../types';
import { API_BASE_URL } from '../../api/apiConfig';


interface RegisterPageProps {
  onLogin: (role: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Local validation
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required' as any;
    if (!formData.lastName) newErrors.lastName = 'Last name is required' as any;
    if (!formData.email) newErrors.email = 'Email is required' as any;
    if (!formData.password) newErrors.password = 'Password is required' as any;
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password' as any;
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match' as any;
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms' as any;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role_name: formData.userType,
        }),
      });


      const data = await response.json();

      if (!response.ok) {
        setErrors({ email: data.message || 'Registration failed' } as any);
        return;
      }


      // 2️⃣ Auto-login after successful registration
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        const role = loginData.result.role_name.toLowerCase();
        onLogin(role);
        // Special redirect for new signups to complete their profile
        navigate('/profile?setup=true');
      } else {
        // If auto-login fails for some reason, just go to login page
        navigate('/login');
      }


    } catch (err) {
      setErrors({ email: 'Something went wrong. Please try again.' } as any);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] via-white to-[#E8F5E9] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#5ba409] rounded-full opacity-5 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC107] rounded-full opacity-5 blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-8 animate-slideInLeft">
          <img
            src="/src/assets/logo/AgriLinkGREEN.png"
            alt="AgriLink Logo"
            className="w-56 h-56 object-contain"
          />
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 leading-tight">
              Join Our
              <span className="block text-[#5ba409] mt-2">Community</span>
            </h2>
            <p className="text-xl text-gray-600">
              Create your account and start connecting with local farmers for fresh, sustainable produce.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-[#5ba409]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Direct Sourcing</h3>
                  <p className="text-sm text-gray-600">Buy directly from local farmers</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-[#5ba409]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Fresh Produce</h3>
                  <p className="text-sm text-gray-600">Get the freshest products daily</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-[#5ba409]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Support Local</h3>
                  <p className="text-sm text-gray-600">Help your local community thrive</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-slideInRight">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-100">
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <img
                src="/src/assets/logo/AgriLinkGREEN.png"
                alt="AgriLink Logo"
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join our community today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-[#5ba409]'
                      }`}
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-[#5ba409]'
                      }`}
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#5ba409]'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">I want to join as a...</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'buyer' })}
                    className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                      formData.userType === 'buyer'
                        ? 'border-[#5ba409] bg-green-50/50 shadow-lg shadow-green-900/5'
                        : 'border-gray-100 bg-gray-50/50 hover:border-green-200 hover:bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      formData.userType === 'buyer' ? 'bg-[#5ba409] text-white' : 'bg-white text-gray-400 group-hover:text-[#5ba409]'
                    }`}>
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`font-black text-sm ${formData.userType === 'buyer' ? 'text-gray-900' : 'text-gray-500'}`}>Buyer</p>
                      <p className="text-[10px] font-medium text-gray-400">Order fresh produce</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'farmer' })}
                    className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                      formData.userType === 'farmer'
                        ? 'border-[#5ba409] bg-green-50/50 shadow-lg shadow-green-900/5'
                        : 'border-gray-100 bg-gray-50/50 hover:border-green-200 hover:bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      formData.userType === 'farmer' ? 'bg-[#5ba409] text-white' : 'bg-white text-gray-400 group-hover:text-[#5ba409]'
                    }`}>
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`font-black text-sm ${formData.userType === 'farmer' ? 'text-gray-900' : 'text-gray-500'}`}>Farmer</p>
                      <p className="text-[10px] font-medium text-gray-400">Sell your crops</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#5ba409]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#5ba409]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5 cursor-pointer" /> : <Eye className="w-5 h-5 cursor-pointer" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start space-x-3 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-gray-200 text-[#5ba409] focus:ring-[#5ba409] accent-[#5ba409] cursor-pointer transition-all mt-0.5"
                />
                <label className="text-sm text-gray-600 font-medium leading-relaxed cursor-pointer group-hover:text-gray-900 transition-colors">
                  I agree to the{' '}
                  <button type="button" className="font-bold text-[#5ba409] hover:underline cursor-pointer">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="font-bold text-[#5ba409] hover:underline cursor-pointer">
                    Privacy Policy
                  </button>
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-500 text-sm font-semibold">{errors.agreeToTerms}</p>}

              <button
                type="submit"
                className="w-full bg-[#5ba409] hover:bg-[#4d8f08] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-bold text-[#5ba409] hover:text-[#4d8f08] cursor-pointer transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};