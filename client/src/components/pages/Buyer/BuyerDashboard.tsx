import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../ui/DashboardCard';
import ProductCard from '../../ui/ProductCard';
import type { Product } from '../../../types';

import * as cartService from '../../../services/cartService';

const BuyerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(cartService.getCartCount());

  useEffect(() => {
    const handleCartUpdate = () => setCartCount(cartService.getCartCount());
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const userName = localStorage.getItem('agrilink_firstName') || 'Buyer';
  const userId = localStorage.getItem('agrilink_userId');
  const token = localStorage.getItem('agrilink_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch('http://localhost:5000/api/products');
        if (!productsRes.ok) throw new Error('Failed to fetch products');
        const productsData = await productsRes.json();
        if (productsData.products) {
          const mappedProducts: Product[] = productsData.products.map((p: any) => ({
            id: p.p_id,
            name: p.p_name,
            price: parseFloat(p.p_price),
            unit: p.p_unit,
            seller: `${p.first_name} ${p.last_name}`,
            location: 'Local Farm',
            stock: parseFloat(p.p_quantity),
            image: p.p_image || '🌱',
            category: p.cat_name || 'Others',
            badges: p.p_status === 'active' ? ['Direct Source'] : []
          }));
          setProducts(mappedProducts);
        }

        if (userId && token) {
           const ordersRes = await fetch(`http://localhost:5000/api/purchases/buyer/${userId}`, {
             headers: { Authorization: `Bearer ${token}` }
           });
           if (!ordersRes.ok) throw new Error('Failed to fetch orders');
           const ordersData = await ordersRes.json();
           setOrders(ordersData.orders || []);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, token]);

  const activeOrders = orders.filter(o => o.req_status !== 'Completed' && o.req_status !== 'Cancelled');
  const completedOrders = orders.filter(o => o.req_status === 'Completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#F9FBE7] to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F9FBE7] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Buyer Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, {userName}! 🛒</p>
        </div>

        {/* Profile Setup Action Required */}
        <div className="bg-red-50 border-l-4 border-red-500 p-5 mb-8 rounded-r-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full hidden sm:block">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-red-900 font-bold text-lg">Action Required: Complete Your Profile</h3>
              <p className="text-red-700 text-sm">You need to set up your delivery address and pin your location before buying.</p>
            </div>
          </div>
          <Link to="/profile?setup=true" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap shadow-md transition-colors text-center w-full sm:w-auto">
            Setup Address
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            icon={ShoppingCart}
            title="Cart Items"
            value={cartCount.toString()}
            subtitle="Items in your basket"
            color="#5ba409"
          />
          <DashboardCard
            icon={Package}
            title="Active Orders"
            value={activeOrders.length.toString()}
            subtitle="Processing / Transporting"
            color="#FFC107"
          />
          <DashboardCard
            icon={CheckCircle}
            title="Completed"
            value={completedOrders.length.toString()}
            subtitle="All time successful"
            color="#2196F3"
          />
        </div>

        {/* My Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
          <div className="space-y-4">
            {orders.length > 0 ? orders.slice(0, 5).map((order) => (
              <div key={order.req_id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-green-600 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-gray-900">Order #{order.req_id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.req_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.req_status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.req_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.req_status}
                    </span>
                  </div>
                  <p className="text-gray-600"><span className="font-semibold">Items:</span> {order.p_name} (x{order.quantity})</p>
                  <p className="text-gray-600"><span className="font-semibold">Farmer:</span> {order.farmer_first} {order.farmer_last}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <Clock className="inline w-4 h-4 mr-1" />
                    {new Date(order.req_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-2">
                  <span className="text-2xl font-bold text-green-600">₱{(order.quantity * order.p_price).toLocaleString()}</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    View Details
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">You have no orders yet.</p>
            )}
          </div>
        </div>

        {/* Recommended Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
