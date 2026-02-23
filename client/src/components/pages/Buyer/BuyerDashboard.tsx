import React from 'react';
import { ShoppingCart, Package, CheckCircle, Clock } from 'lucide-react';
import { sampleProducts, buyerOrders } from '../../../data';
import DashboardCard from '../../ui/DashboardCard';
import ProductCard from '../../ui/ProductCard';

const BuyerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Buyer Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, Maria! 🛒</p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            icon={ShoppingCart}
            title="Cart Items"
            value="5"
            subtitle="₱1,250 total"
            color="#5ba409"
          />
          <DashboardCard
            icon={Package}
            title="Active Orders"
            value="3"
            subtitle="2 in transit"
            color="#FFC107"
          />
          <DashboardCard
            icon={CheckCircle}
            title="Completed"
            value="28"
            subtitle="This month"
            color="#2196F3"
          />
        </div>

        {/* My Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
          <div className="space-y-4">
            {buyerOrders.map((order) => (
              <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-[#5ba409] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600"><span className="font-semibold">From:</span> {order.farmer}</p>
                  <p className="text-gray-600"><span className="font-semibold">Items:</span> {order.items}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock className="inline w-4 h-4 mr-1" />
                    {order.date}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <span className="text-2xl font-bold text-[#5ba409]">{order.amount}</span>
                  <button className="bg-[#5ba409] hover:bg-[#4d8f08] text-white px-4 py-2 rounded-lg font-semibold">
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
