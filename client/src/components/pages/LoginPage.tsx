import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api/apiConfig';
import type { LoginFormData, LoginPageProps } from '../../types';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email) newErrors.email = 'Email is required' as any;
    if (!formData.password) newErrors.password = 'Password is required' as any;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ email: data.message || 'Login failed' } as any);
        return;
      }

      // Success
      const role = data.result.role_name.toLowerCase();
      onLogin(role);

      {role === 'admin' ? navigate('/admin-dashboard') : role === 'farmer' ? navigate('/farmer-dashboard') : navigate('/marketplace')}

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
              Welcome Back to
              <span className="block text-[#5ba409] mt-2">AgriLink</span>
            </h2>
            <p className="text-xl text-gray-600">
              Log in to access fresh produce directly from local farmers and support your community.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-[#5ba409] to-[#74c419] rounded-3xl p-6 shadow-2xl">
            <div className="bg-white rounded-2xl p-6 flex justify-center space-x-3 text-5xl">
              <span className="animate-bounce">🌾</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🥕</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🍅</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🥬</span>
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
              <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 text-[#5ba409] border-gray-300 rounded focus:ring-[#5ba409]"
                  />
                  <span className="text-sm font-semibold text-gray-700">Remember me</span>
                </label>
                <button type="button" className="text-sm font-bold text-[#5ba409] hover:text-[#4d8f08] transition-colors">
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5ba409] hover:bg-[#4d8f08] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-bold text-[#5ba409] hover:text-[#4d8f08] transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-center text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Quick Login (Testing Only)</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { onLogin('brgy_official'); navigate('/brgy-dashboard'); }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                >
                  Brgy Official
                </button>
                <button
                  type="button"
                  onClick={() => { onLogin('lgu_official'); navigate('/lgu-dashboard'); }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100"
                >
                  LGU Official
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};