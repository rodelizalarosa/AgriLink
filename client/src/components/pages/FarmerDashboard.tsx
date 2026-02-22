import React from 'react';
import { Plus, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FarmerDashboardProps } from '../../types';
import { sampleProducts, farmerOrders } from '../../data';
import DashboardCard from '../ui/DashboardCard';

const FarmerDashboard: React.FC<FarmerDashboardProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Farmer Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome back, Juan dela Cruz! 👨‍🌾</p>
          </div>
          <button
            onClick={() => navigate('/product-upload')}
            className="bg-[#5ba409] hover:bg-[#4d8f08] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={Package}
            title="Active Listings"
            value="12"
            subtitle="4 low on stock"
            color="#5ba409"
          />
          <DashboardCard
            icon={ShoppingCart}
            title="Orders Today"
            value="8"
            subtitle="3 pending"
            color="#FFC107"
            trend="+15% from yesterday"
          />
          <DashboardCard
            icon={TrendingUp}
            title="Total Sales"
            value="₱24,500"
            subtitle="This month"
            color="#2196F3"
            trend="+23% from last month"
          />
          <DashboardCard
            icon={Users}
            title="Customers"
            value="156"
            subtitle="45 returning"
            color="#8D6E63"
          />
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Product</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Price</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Stock</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sampleProducts.slice(0, 4).map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-[#F9FBE7] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {product.image.startsWith('http') || product.image.includes('.') ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-3xl">{product.image}</span>
                        )}
                        <span className="font-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-[#5ba409]">₱{product.price}/{product.unit}</td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${product.stock < 20 ? 'text-red-600' : 'text-gray-700'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-[#5ba409] hover:text-[#4d8f08] font-semibold mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-700 font-semibold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {farmerOrders.map((order) => (
              <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-[#5ba409] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600"><span className="font-semibold">Buyer:</span> {order.buyer}</p>
                  <p className="text-gray-600"><span className="font-semibold">Product:</span> {order.product} × {order.qty}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <span className="text-2xl font-bold text-[#5ba409]">{order.amount}</span>
                  <button className="bg-[#5ba409] hover:bg-[#4d8f08] text-white px-4 py-2 rounded-lg font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
