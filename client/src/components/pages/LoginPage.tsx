import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../../types';
import { supabase } from '../../services/supabase-client';
import LoadingSpinner from '../ui/LoadingSpinner'; 

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false); // ✅ spinner state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: Partial<LoginFormData> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true); // show spinner

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error || !data.user) {
        setErrors({ password: 'Invalid email or password' });
        setIsLoading(false);
        return;
      }

      console.log('User is logged in:', data.user);

      const userId = data.user.id;

      // Fetch role
      const { data: userData } = await supabase
        .from('users_table')
        .select('role_id')
        .eq('id', userId)
        .maybeSingle();

      // Optional: smooth delay
      await new Promise((res) => setTimeout(res, 500));

      // Redirect based on role
      if (userData) {
        switch (userData.role_id) {
          case 1:
            navigate('/buyer-dashboard');
            break;
          case 2:
            navigate('/farmer-dashboard');
            break;
          case 3:
            navigate('/lgu-dashboard');
            break;
          case 4:
            navigate('/brgy-dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        console.warn('Role not found, redirecting to main page');
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed silently:', err);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] via-white to-[#E8F5E9] flex items-center justify-center p-4 relative">
      
      {/* Loading Spinner overlay */}
      {isLoading && <LoadingSpinner message="Logging you in..." />}

      {!isLoading && (
        <>
          {/* Background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#4CAF50] rounded-full opacity-5 blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC107] rounded-full opacity-5 blur-3xl animate-float-delayed"></div>
          </div>

          {/* Main content */}
          <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left side */}
            <div className="hidden lg:block space-y-8 animate-slideInLeft">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] p-4 rounded-2xl shadow-lg">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-[#2E7D32]">AgriLink</h1>
                  <p className="text-[#8D6E63] font-semibold">Farm to Table</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-gray-900 leading-tight">
                  Welcome Back to
                  <span className="block text-[#4CAF50] mt-2">AgriLink</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Log in to access fresh produce directly from local farmers and support your community.
                </p>
              </div>

              <div className="relative bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-3xl p-6 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 flex justify-center space-x-3 text-5xl">
                  <span className="animate-bounce">🌾</span>
                  <span className="animate-bounce" style={{animationDelay: '0.1s'}}>🥕</span>
                  <span className="animate-bounce" style={{animationDelay: '0.2s'}}>🍅</span>
                  <span className="animate-bounce" style={{animationDelay: '0.3s'}}>🥬</span>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="animate-slideInRight">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-100">
                
                <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                  <div className="bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] p-3 rounded-2xl shadow-lg">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-[#2E7D32]">AgriLink</h1>
                    <p className="text-xs text-[#8D6E63] font-semibold">Farm to Table</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back!</h2>
                  <p className="text-gray-600">Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
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
                          errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#4CAF50]'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.email}</p>}
                  </div>

                  {/* Password */}
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
                          errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#4CAF50]'
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

                  {/* Remember me / Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        className="w-4 h-4 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50]"
                      />
                      <span className="text-sm font-semibold text-gray-700">Remember me</span>
                    </label>
                    <button type="button" className="text-sm font-bold text-[#4CAF50] hover:text-[#45A049] transition-colors">
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#4CAF50] hover:bg-[#45A049] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>

                {/* Sign up link */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="font-bold text-[#4CAF50] hover:text-[#45A049] transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
