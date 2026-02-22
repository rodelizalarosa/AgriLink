import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormData } from '../../types';
import { API_BASE_URL } from '../../api/apiConfig';


export const RegisterPage: React.FC = () => {
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
        // Backend returned an error
        setErrors({ email: data.message || 'Registration failed' } as any);
        return;
      }


      // Success
      navigate('/login'); // redirect to login after successful registration


    } catch (err) {
      setErrors({ email: 'Something went wrong. Please try again.' } as any);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] via-white to-[#E8F5E9] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4CAF50] rounded-full opacity-5 blur-3xl animate-float"></div>
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
              <span className="block text-[#4CAF50] mt-2">Community</span>
            </h2>
            <p className="text-xl text-gray-600">
              Create your account and start connecting with local farmers for fresh, sustainable produce.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
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
                  <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
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
                  <CheckCircle className="w-6 h-6 text-[#4CAF50]" />
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
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-[#4CAF50]'
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
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-[#4CAF50]'
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
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#4CAF50]'
                      }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 font-semibold">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'buyer' })}
                    className={`py-3 px-4 rounded-xl font-bold cursor-pointer transition-all ${formData.userType === 'buyer'
                      ? 'bg-[#4CAF50] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: 'farmer' })}
                    className={`py-3 px-4 rounded-xl font-bold cursor-pointer transition-all ${formData.userType === 'farmer'
                      ? 'bg-[#4CAF50] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Farmer
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
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#4CAF50]'
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
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none font-semibold transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#4CAF50]'
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

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="w-4 h-4 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50] mt-1"
                />
                <label className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button type="button" className="font-bold text-[#4CAF50] hover:text-[#45A049] cursor-pointer transition-colors">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="font-bold text-[#4CAF50] hover:text-[#45A049] cursor-pointer transition-colors">
                    Privacy Policy
                  </button>
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-500 text-sm font-semibold">{errors.agreeToTerms}</p>}

              <button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#45A049] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
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
                  className="font-bold text-[#4CAF50] hover:text-[#45A049] cursor-pointer transition-colors"
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