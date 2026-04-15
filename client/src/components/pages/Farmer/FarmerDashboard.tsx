import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  DollarSign,
  Package,
  RefreshCcw,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Pencil,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getServerStaticOrigin } from '../../../api/apiConfig';
import type { FarmerDashboardProps } from '../../../types';
import DashboardCard from '../../ui/DashboardCard';
import { useToast } from '../../ui/Toast';
import Modal from '../../ui/Modal';
import ProductDetailModal from '../../ui/ProductDetailModal';

const resolveImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = getServerStaticOrigin();
  return `${baseUrl}${path}`;
};

const FarmerDashboard: React.FC<FarmerDashboardProps> = () => {
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [productToArchive, setProductToArchive] = useState<any | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<any | null>(null);

  const userId = localStorage.getItem('agrilink_id');
  const firstName = localStorage.getItem('agrilink_firstName') || 'Farmer';

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('agrilink_onboarding_completed') === '1';
  });

  const fetchData = async () => {
    if (!userId) {
      setError('User session expired. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('agrilink_token');

      const [prodRes, orderRes, earnRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products/farmer/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/purchases/farmer/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/purchases/earnings/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!prodRes.ok || !orderRes.ok || !earnRes.ok) {
        throw new Error('Some data failed to sync. Please retry.');
      }

      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const earnData = await earnRes.json();

      setProducts(prodData.products || []);
      setOrders(orderData.orders || []);
      setEarnings(earnData.summary?.total_earnings || 0);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Connection with server failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleRefresh = () => fetchData();
    window.addEventListener('product-added', handleRefresh);
    window.addEventListener('order-updated', handleRefresh);
    window.addEventListener('product-updated', handleRefresh);

    const handleCompletion = () => setOnboardingCompleted(true);
    window.addEventListener('agrilink-onboarding-completed', handleCompletion);

    return () => {
      window.removeEventListener('product-added', handleRefresh);
      window.removeEventListener('order-updated', handleRefresh);
      window.removeEventListener('product-updated', handleRefresh);
      window.removeEventListener('agrilink-onboarding-completed', handleCompletion);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const activeProducts = useMemo(() => products.filter((p) => String(p.p_status).toLowerCase() === 'active'), [products]);
  const pendingOrders = useMemo(() => orders.filter((o) => String(o.req_status).toLowerCase() === 'pending'), [orders]);
  const lowStockCount = useMemo(() => activeProducts.filter((p) => Number(p.p_quantity) < 20).length, [activeProducts]);

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      String(p.p_name || '').toLowerCase().includes(q) ||
      String(p.cat_name || '').toLowerCase().includes(q)
    );
  }, [products, searchTerm]);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem('agrilink_token');
      const response = await fetch(`${API_BASE_URL}/products/${productToDelete.p_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ u_id: userId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Deletion failed.');

      showSuccess('Listing deleted.');
      setDeleteOpen(false);
      setProductToDelete(null);
      fetchData();
    } catch (err: any) {
      showError(err.message || 'Failed to delete listing.');
    }
  };

  const handleArchiveProduct = async () => {
    if (!productToArchive) return;

    try {
      const token = localStorage.getItem('agrilink_token');
      const response = await fetch(`${API_BASE_URL}/products/archive/${productToArchive.p_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ u_id: userId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Archive failed.');

      showSuccess('Listing archived.');
      setArchiveOpen(false);
      setProductToArchive(null);
      fetchData();
    } catch (err: any) {
      showError(err.message || 'Failed to archive listing.');
    }
  };

  const handleUnarchiveProduct = async (productId: number) => {
    try {
      const token = localStorage.getItem('agrilink_token');
      const response = await fetch(`${API_BASE_URL}/products/unarchive/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ u_id: userId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Restore failed.');

      showSuccess('Listing restored.');
      fetchData();
    } catch (err: any) {
      showError(err.message || 'Failed to restore listing.');
    }
  };

  return (
    <div className="agri-farmer ag-page">
      <div className="ag-container">
        <div className="ag-header">
          <div>
            <div className="ag-kicker">
              <span className="ag-kicker-dot" />
              Dashboard
            </div>
            <h1 className="ag-display ag-title">Welcome back, {firstName}</h1>
            <p className="ag-subtitle">Overview of listings, orders, and earnings.</p>
          </div>

          <div className="ag-actions">
            <button type="button" onClick={fetchData} className="ag-btn ag-btn-secondary">
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
            <button type="button" onClick={() => navigate('/farmer/upload')} className="ag-btn ag-btn-primary">
              Add listing
            </button>
          </div>
        </div>

        {!onboardingCompleted && (
          <div className="mb-6 ag-card ag-card-pad">
            <p className="font-semibold text-slate-900">Complete onboarding to unlock your farmer workspace.</p>
            <p className="text-sm text-slate-600 mt-1">Follow the steps in your profile to finish setup.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="font-semibold text-red-900">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="py-28 flex flex-col items-center gap-4">
            <RefreshCcw className="w-10 h-10 text-[#5ba409] animate-spin" />
            <p className="text-sm font-semibold text-slate-500">Loading dashboard�</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                icon={Package}
                title="Active listings"
                value={String(activeProducts.length)}
                subtitle="Visible to buyers"
                color="#5ba409"
              />
              <DashboardCard
                icon={ShoppingCart}
                title="Pending orders"
                value={String(pendingOrders.length)}
                subtitle="Needs your review"
                color="#f59e0b"
              />
              <DashboardCard
                icon={TrendingUp}
                title="Low stock"
                value={String(lowStockCount)}
                subtitle="Below 20 units"
                color="#0ea5e9"
              />
              <DashboardCard
                icon={DollarSign}
                title="Total earnings"
                value={`PHP ${Number(earnings || 0).toLocaleString()}`}
                subtitle="Completed orders"
                color="#111827"
              />
            </div>

            <div className="mt-6 ag-card ag-card-pad">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                <div>
                  <h2 className="ag-display text-xl font-extrabold text-slate-900">Listings</h2>
                  <p className="text-sm text-slate-600">Search and manage your products.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <Search className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or category�"
                    className="ag-input"
                    aria-label="Search listings"
                  />
                  <button type="button" onClick={() => navigate('/farmer/listings')} className="ag-btn ag-btn-secondary">
                    View all
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 ag-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="ag-table">
                  <thead>
                    <tr>
                      <th className="ag-th">Product</th>
                      <th className="ag-th">Category</th>
                      <th className="ag-th">Price</th>
                      <th className="ag-th">Stock</th>
                      <th className="ag-th">Status</th>
                      <th className="ag-th" style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center">
                          <p className="text-slate-600 font-semibold">No listings match your search.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.slice(0, 12).map((p) => {
                        const img = resolveImageUrl(p.p_image);
                        const status = String(p.p_status || '').toLowerCase();
                        const isArchived = status === 'archive';

                        return (
                          <tr key={p.p_id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="ag-td">
                              <button
                                type="button"
                                className="flex items-center gap-3 text-left"
                                onClick={() => {
                                  setSelectedProductForDetail(p);
                                  setDetailOpen(true);
                                }}
                              >
                                <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shrink-0">
                                  {img ? (
                                    <img src={img} alt={p.p_name} className="w-full h-full object-cover" />
                                  ) : null}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900 truncate">{p.p_name}</p>
                                  <p className="text-xs text-slate-500 truncate">ID: {p.p_id}</p>
                                </div>
                              </button>
                            </td>
                            <td className="ag-td">
                              <p className="text-sm text-slate-700 font-semibold">{p.cat_name || '�'}</p>
                            </td>
                            <td className="ag-td">
                              <p className="text-sm text-slate-900 font-semibold">PHP {Number(p.p_price || 0).toLocaleString()}</p>
                            </td>
                            <td className="ag-td">
                              <p className="text-sm text-slate-700 font-semibold">{p.p_quantity} {p.p_unit}</p>
                            </td>
                            <td className="ag-td">
                              <span
                                className={
                                  isArchived
                                    ? 'inline-flex px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold'
                                    : 'inline-flex px-3 py-1 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold'
                                }
                              >
                                {isArchived ? 'Archived' : 'Active'}
                              </span>
                            </td>
                            <td className="ag-td" style={{ textAlign: 'right' }}>
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  className="ag-btn ag-btn-secondary"
                                  onClick={() => navigate(`/farmer/edit-product/${p.p_id}`)}
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                {isArchived ? (
                                  <button
                                    type="button"
                                    className="ag-btn ag-btn-secondary"
                                    onClick={() => handleUnarchiveProduct(p.p_id)}
                                  >
                                    Restore
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="ag-btn ag-btn-secondary"
                                    onClick={() => {
                                      setProductToArchive(p);
                                      setArchiveOpen(true);
                                    }}
                                  >
                                    <Archive className="w-4 h-4" />
                                    Archive
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="ag-btn ag-btn-danger"
                                  onClick={() => {
                                    setProductToDelete(p);
                                    setDeleteOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length > 12 && (
                <div className="ag-card-pad ag-divider">
                  <button type="button" onClick={() => navigate('/farmer/listings')} className="ag-btn ag-btn-secondary">
                    View all listings ({filteredProducts.length})
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="ag-card ag-card-pad">
                <h2 className="ag-display text-xl font-extrabold text-slate-900">Orders</h2>
                <p className="text-sm text-slate-600 mt-1">Pending requests require confirmation before fulfillment.</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => navigate('/farmer/orders')} className="ag-btn ag-btn-primary">
                    Review orders
                  </button>
                  <button type="button" onClick={() => navigate('/farmer/earnings')} className="ag-btn ag-btn-secondary">
                    View earnings
                  </button>
                </div>
              </div>

              <div className="ag-card ag-card-pad">
                <h2 className="ag-display text-xl font-extrabold text-slate-900">Phenotyping</h2>
                <p className="text-sm text-slate-600 mt-1">See quality results for scanned crops and grades.</p>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => navigate('/farmer/phenotyping')} className="ag-btn ag-btn-secondary">
                    View results
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <Modal
          isOpen={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setProductToDelete(null);
          }}
          title="Delete listing"
          size="md"
        >
          <div className="agri-farmer space-y-4">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
              <p className="font-semibold text-slate-900">This will permanently delete the listing.</p>
              <p className="text-sm text-slate-700 mt-1">{productToDelete?.p_name}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDeleteOpen(false)} className="ag-btn ag-btn-secondary flex-1">
                Keep
              </button>
              <button type="button" onClick={handleDeleteProduct} className="ag-btn ag-btn-danger flex-1">
                Delete
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={archiveOpen}
          onClose={() => {
            setArchiveOpen(false);
            setProductToArchive(null);
          }}
          title="Archive listing"
          size="md"
        >
          <div className="agri-farmer space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="font-semibold text-slate-900">Archive this listing?</p>
              <p className="text-sm text-slate-700 mt-1">{productToArchive?.p_name}</p>
              <p className="text-sm text-slate-600 mt-2">Archived listings are hidden from buyers until restored.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setArchiveOpen(false)} className="ag-btn ag-btn-secondary flex-1">
                Keep active
              </button>
              <button type="button" onClick={handleArchiveProduct} className="ag-btn ag-btn-primary flex-1">
                Archive
              </button>
            </div>
          </div>
        </Modal>

        <ProductDetailModal
          isOpen={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setSelectedProductForDetail(null);
          }}
          product={selectedProductForDetail}
        />
      </div>
    </div>
  );
};

export default FarmerDashboard;