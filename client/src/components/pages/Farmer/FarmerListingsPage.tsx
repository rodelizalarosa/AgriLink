import React, { useState, useEffect } from 'react';
import { Leaf, Package, Search, Filter, Edit3, Trash2, ExternalLink, RefreshCcw, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../api/apiConfig';
import { useToast } from '../../ui/Toast';
import Modal from '../../ui/Modal';
import ProductDetailModal from '../../ui/ProductDetailModal';
import { Plus } from 'lucide-react';

const resolveImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}${path}`;
};

const FarmerListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [productToArchive, setProductToArchive] = useState<any | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<any | null>(null);

  const userId = localStorage.getItem('agrilink_id');

  const fetchProducts = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('agrilink_token');
      const res = await fetch(`${API_BASE_URL}/products/farmer/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data.products || []);
      else setError(data.message);
    } catch (err) {
      setError('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem('agrilink_token');
      const res = await fetch(`${API_BASE_URL}/products/${productToDelete.p_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ u_id: userId })
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess('Crop deleted successfully!');
        fetchProducts();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } else {
        showError(data.message || 'Deletion failed.');
      }
    } catch (err) {
      showError('The server encountered an issue while deleting your listing.');
    }
  };

  const openDeleteModal = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const openArchiveModal = (product: any) => {
    setProductToArchive(product);
    setIsArchiveModalOpen(true);
  };

  const openDetailModal = (product: any) => {
    setSelectedProductForDetail(product);
    setIsDetailModalOpen(true);
  };

  const handleArchive = async () => {
    if (!productToArchive) return;

    try {
      const token = localStorage.getItem('agrilink_token');
      const res = await fetch(`${API_BASE_URL}/products/archive/${productToArchive.p_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ u_id: userId })
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess('Harvest archived successfully!');
        fetchProducts();
        setIsArchiveModalOpen(false);
        setProductToArchive(null);
      } else {
        showError(data.message || 'Archive failed.');
      }
    } catch (err) {
      showError('The server encountered an issue while archiving your listing.');
    }
  };

  const handleUnarchive = async (productId: number) => {
    try {
      const token = localStorage.getItem('agrilink_token');
      const res = await fetch(`${API_BASE_URL}/products/unarchive/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ u_id: userId })
      });
      const data = await res.json();
      if (res.ok) {
        showSuccess('Harvest restored successfully!');
        fetchProducts();
      } else {
        showError(data.message || 'Restoration failed.');
      }
    } catch (err) {
      showError('The server encountered an issue while restoring your listing.');
    }
  };

  const filteredProducts = products.filter(p =>
    p.p_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.cat_name && p.cat_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col overflow-hidden">
      {/* 🌊 Background Artistic Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#5ba409]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#4d8f08]/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 py-10 lg:px-12 lg:py-16 flex flex-col gap-12 animate-fadeIn">

        {/* 🎨 Elite Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 animate-slideInLeft">
              <Leaf className="w-3.5 h-3.5 text-[#5ba409]" />
              <span className="text-[10px] font-black text-[#5ba409] uppercase tracking-[0.4em] italic mb-1">Merchant Inventory System</span>
            </div>
            <div>
              <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-3">
                My Harvests<span className="text-[#5ba409] not-italic">.</span>
              </h1>
              <p className="text-[13px] text-gray-400 font-bold uppercase tracking-[0.2em] italic max-w-xl leading-relaxed">
                Precision monitoring and management of your digital marketplace listings.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 w-full xl:w-auto animate-slideInRight">
            <div className="relative w-full sm:w-[400px] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#5ba409] transition-colors" />
              <input
                type="text"
                placeholder="Lookup active listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#5ba409] rounded-2xl outline-none transition-all font-black text-xs uppercase italic text-gray-700 shadow-sm focus:shadow-2xl focus:shadow-green-900/5 placeholder:text-gray-300"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#5ba409] hover:text-[#5ba409] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 group">
                <Filter className="w-5 h-5 text-gray-400 group-hover:text-[#5ba409] transition-colors" />
                <span className="text-[10px] font-black uppercase italic tracking-widest hidden sm:inline">Refine</span>
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-add-product'))}
                className="flex-1 sm:flex-none bg-gradient-to-br from-[#5ba409] to-[#4d8f08] text-white px-8 py-5 rounded-2xl shadow-xl shadow-green-900/10 hover:shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 group"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span className="text-[10px] font-black uppercase italic tracking-[0.2em]">New Harvest</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="animate-scaleIn p-6 bg-red-50/50 backdrop-blur-sm border-2 border-red-100/50 rounded-[2rem] flex items-center gap-5 shadow-xl shadow-red-900/5">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">System Interrupt</p>
              <p className="font-black text-red-900 text-sm italic uppercase">{error}</p>
            </div>
          </div>
        )}

        {/* 📊 Inventory Grid/Table Section */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center animate-fadeIn gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] animate-pulse" />
              <RefreshCcw className="absolute inset-0 m-auto w-10 h-10 text-[#5ba409] animate-spin-slow" />
            </div>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic animate-pulse">Synchronizing Data Vault...</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden animate-scaleIn">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-8 px-10 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] italic">Product Detail</th>
                    <th className="py-8 px-10 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] italic">Inventory</th>
                    <th className="py-8 px-10 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] italic">Pricing</th>
                    <th className="py-8 px-10 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] italic">Status</th>
                    <th className="py-8 px-10 font-black text-[10px] text-gray-400 uppercase tracking-[0.3em] italic text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-32 text-center bg-white">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gray-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          <Package className="w-10 h-10 text-gray-200 relative z-10" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-2">No Records Detected</h3>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic leading-none">Your inventory vault is currently empty.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.p_id}
                        onClick={() => openDetailModal(product)}
                        className="group hover:bg-green-50/30 transition-all duration-500 cursor-pointer border-l-4 border-transparent hover:border-[#5ba409]"
                      >
                        <td className="py-8 px-10">
                          <div className="flex items-center gap-7">
                            <div className="w-20 h-20 bg-slate-50 rounded-[1.75rem] overflow-hidden border-2 border-transparent group-hover:border-[#5ba409]/20 transition-all shrink-0 shadow-sm relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent pointer-events-none" />
                              {product.p_image ? (
                                <img src={resolveImageUrl(product.p_image)} alt={product.p_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-200 font-black text-[9px] uppercase tracking-widest italic text-center px-4">Secure Logic</div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-xl tracking-tighter uppercase italic leading-none mb-2 group-hover:text-[#5ba409] transition-colors">{product.p_name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-[#5ba409] bg-green-50 px-3 py-1.5 rounded-lg uppercase tracking-widest italic">{product.cat_name || 'Agri Product'}</span>
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">ID: {product.p_id.toString().padStart(5, '0')}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-10">
                          <div className="flex items-end gap-1.5">
                            <span className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none">{product.p_quantity}</span>
                            <span className="text-[11px] font-black text-gray-500 uppercase italic tracking-widest mb-0.5">{product.p_unit}</span>
                          </div>
                        </td>
                        <td className="py-8 px-10">
                          <div className="space-y-1">
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic leading-none">₱{Number(product.p_price).toLocaleString()} / {product.p_unit}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xl font-black text-gray-900 tracking-tighter italic">₱{Number(product.p_price).toLocaleString()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-10">
                          {product.p_status === 'active' ? (
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 text-[#5ba409] rounded-2xl border border-[#5ba409]/10 transform hover:scale-105 transition-all">
                              <Leaf className="w-3.5 h-3.5 text-[#5ba409]" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Active</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-100 text-gray-400 rounded-2xl border border-gray-200">
                              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Archived</span>
                            </div>
                          )}
                        </td>
                        <td className="py-8 px-10" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-3 transition-all duration-300">
                            <button
                              onClick={() => window.dispatchEvent(new CustomEvent('open-edit-product', { detail: product }))}
                              className="w-12 h-12 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#5ba409] hover:border-[#5ba409] hover:shadow-2xl hover:shadow-green-900/10 transition-all active:scale-90 flex items-center justify-center group/btn"
                              title="Edit"
                            >
                              <Edit3 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            {product.p_status === 'active' ? (
                              <button
                                onClick={() => openArchiveModal(product)}
                                className="w-12 h-12 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-amber-500 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-900/10 transition-all active:scale-90 flex items-center justify-center group/btn"
                                title="Archive"
                              >
                                <AlertTriangle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnarchive(product.p_id)}
                                className="w-12 h-12 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-green-500 hover:border-green-500 hover:shadow-2xl hover:shadow-green-900/10 transition-all active:scale-90 flex items-center justify-center group/btn"
                                title="Restore Listing"
                              >
                                <RefreshCcw className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                              </button>
                            )}
                            <button
                              onClick={() => openDeleteModal(product)}
                              className="w-12 h-12 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 hover:shadow-2xl hover:shadow-red-900/10 transition-all active:scale-90 flex items-center justify-center group/btn"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/buyer/marketplace?search=${product.p_name}`);
                              }}
                              className="w-12 h-12 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/10 transition-all active:scale-90 flex items-center justify-center group/btn"
                              title="View in Marketplace"
                            >
                              <ExternalLink className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 🗑️ Elite Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        title="Listing Authorization"
      >
        <div className="space-y-8 p-1">
          <div className="flex flex-col gap-6 relative overflow-hidden">
            {/* 🌿 Modal Decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <Leaf className="absolute top-4 right-4 w-4 h-4 text-red-500/10 -rotate-12 pointer-events-none" />

            <div className="flex items-center gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 group transition-all hover:bg-white hover:border-red-100 hover:shadow-2xl hover:shadow-red-900/5 relative z-10">
              <div className="w-24 h-24 bg-white rounded-[1.75rem] overflow-hidden border border-gray-100 shrink-0 shadow-sm relative group-hover:border-red-100 transition-all">
                {productToDelete?.p_image ? (
                  <img
                    src={resolveImageUrl(productToDelete.p_image)}
                    alt={productToDelete.p_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200 font-black text-[8px] uppercase tracking-widest italic text-center px-4">Secure Data</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black text-red-400 uppercase tracking-widest italic bg-red-50 px-3 py-1 rounded-lg">Purge List</span>
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest italic bg-red-50 px-3 py-1 rounded-lg">Remove Listing</span>
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">ID: {productToDelete?.p_id.toString().padStart(5, '0')}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none truncate mb-2 group-hover:text-red-600 transition-colors">
                  {productToDelete?.p_name}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-end gap-1">
                    <span className="text-sm font-black text-gray-700 italic">{productToDelete?.p_quantity}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase italic mb-0.5">{productToDelete?.p_unit}</span>
                  </div>
                  <div className="w-px h-3 bg-gray-200" />
                  <span className="text-sm font-black text-[#5ba409] italic">₱{Number(productToDelete?.p_price).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-red-50/30 rounded-2xl border border-red-100/30">
            <p className="text-[12px] text-gray-500 font-bold italic leading-relaxed uppercase tracking-widest">
              Confirming this request will permanently <span className="text-red-600 underline decoration-2 underline-offset-4">REMOVE</span> this harvest listing from your inventory. This action is irreversible.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
              }}
              className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-gray-400 font-black uppercase tracking-[0.3em] italic text-[10px] rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-[1.5] py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.3em] italic text-[10px] rounded-2xl shadow-xl shadow-red-900/10 hover:shadow-red-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 group"
            >
              <Trash2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
              Remove Harvest
            </button>
          </div>
        </div>
      </Modal>

      {/* 📦 Elite Archive Confirmation Modal */}
      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => {
          setIsArchiveModalOpen(false);
          setProductToArchive(null);
        }}
        title="Listing Archive"
      >
        <div className="space-y-8 p-1">
          <div className="flex flex-col gap-6 relative overflow-hidden">
            {/* 🌿 Modal Decorations */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <Leaf className="absolute top-4 right-4 w-4 h-4 text-amber-500/10 -rotate-12 pointer-events-none" />

            <div className="flex items-center gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-gray-100 group transition-all hover:bg-white hover:border-amber-100 hover:shadow-2xl hover:shadow-amber-900/5 relative z-10">
              <div className="w-24 h-24 bg-white rounded-[1.75rem] overflow-hidden border border-gray-100 shrink-0 shadow-sm relative group-hover:border-amber-100 transition-all">
                {productToArchive?.p_image ? (
                  <img
                    src={resolveImageUrl(productToArchive.p_image)}
                    alt={productToArchive.p_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200 font-black text-[8px] uppercase tracking-widest italic text-center px-4">Market Data</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest italic bg-amber-50 px-3 py-1 rounded-lg">Archive Request</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none truncate mb-2 group-hover:text-amber-600 transition-colors">
                  {productToArchive?.p_name}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-end gap-1">
                    <span className="text-sm font-black text-gray-700 italic">{productToArchive?.p_quantity}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase italic mb-0.5">{productToArchive?.p_unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50/30 rounded-2xl border border-amber-100/30">
            <p className="text-[12px] text-gray-500 font-bold italic leading-relaxed uppercase tracking-widest">
              Confirming this will move the listing to <span className="text-amber-600 underline decoration-2 underline-offset-4">ARCHIVE</span>. It will be hidden from buyers but you can restore it anytime.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsArchiveModalOpen(false);
                setProductToArchive(null);
              }}
              className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-gray-400 font-black uppercase tracking-[0.3em] italic text-[10px] rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleArchive}
              className="flex-[1.5] py-5 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-[0.3em] italic text-[10px] rounded-2xl shadow-xl shadow-amber-900/10 hover:shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 group"
            >
              <AlertTriangle className="w-4 h-4 transition-transform group-hover:scale-110" />
              Archive Harvest
            </button>
          </div>
        </div>
      </Modal>
      {/* 📋 Elite Product Detail Modal */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProductForDetail(null);
        }}
        product={selectedProductForDetail}
      />
    </div>
  );
};


export default FarmerListingsPage;
