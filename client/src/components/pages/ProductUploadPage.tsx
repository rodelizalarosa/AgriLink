import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { FormData } from '../../types';

const ProductUploadPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'Vegetables',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    location: ''
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Add New Product</h1>
          <p className="text-lg text-gray-600">List your fresh produce for sale</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Product Image</label>
              <div className="border-3 border-dashed border-[#4CAF50] rounded-2xl p-12 text-center bg-[#F9FBE7] hover:bg-[#E8F5E9] transition-colors cursor-pointer">
                <Plus className="w-16 h-16 mx-auto text-[#4CAF50] mb-4" />
                <p className="text-lg font-semibold text-gray-700">Click to upload image</p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Product Name</label>
              <input
                type="text"
                placeholder="e.g., Organic Tomatoes"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none font-semibold text-lg"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none font-semibold text-lg appearance-none bg-white cursor-pointer"
              >
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
                <option>Poultry</option>
                <option>Dairy</option>
              </select>
            </div>

            {/* Price and Quantity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Price per Unit (₱)</label>
                <input
                  type="number"
                  placeholder="85"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none font-semibold text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Available Quantity</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="50"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none font-semibold text-lg"
                  />
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none font-semibold text-lg appearance-none bg-white cursor-pointer"
                  >
                    <option>kg</option>
                    <option>tray</option>
                    <option>sack</option>
                    <option>piece</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Farm Location</label>
              <input
                type="text"
                placeholder="e.g., Cebu City"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none font-semibold text-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Description</label>
              <textarea
                rows={4}
                placeholder="Tell buyers about your product quality, farming methods, etc."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none font-semibold text-lg resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-[#4CAF50] hover:bg-[#45A049] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Publish Product
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg transition-colors"
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUploadPage;
