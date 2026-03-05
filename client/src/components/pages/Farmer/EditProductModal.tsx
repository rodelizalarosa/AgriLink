import React, { useState, useEffect } from 'react';
import { Leaf, Loader2, AlertCircle, X, CheckCircle2, Image as ImageIcon, Info, ChevronRight, LayoutGrid, RefreshCcw } from 'lucide-react';
import { API_BASE_URL } from '../../../api/apiConfig';
import { useToast } from '../../ui/Toast';

interface EditProductModalProps {
  productId: string | undefined;
  initialProduct?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ productId, initialProduct, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '1',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
    harvest_date: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const userId = localStorage.getItem('agrilink_id');

  const getMinHarvestDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        category: '1',
        price: '',
        quantity: '',
        unit: 'kg',
        description: '',
        harvest_date: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setError('');
      setFieldErrors({});
      setLoading(false);
      setSuccess(false);
      return;
    }

    if (initialProduct) {
      const p = initialProduct;
      setFormData({
        name: p.p_name,
        category: p.p_category?.toString() ?? '1',
        price: p.p_price?.toString() ?? '',
        quantity: p.p_quantity?.toString() ?? '',
        unit: p.p_unit ?? 'kg',
        description: p.p_description ?? '',
        harvest_date: p.harvest_date ? p.harvest_date.split('T')[0] : ''
      });
      if (p.p_image) {
        const baseUrl = API_BASE_URL.replace('/api', '');
        setImagePreview(p.p_image.startsWith('http') ? p.p_image : `${baseUrl}${p.p_image}`);
      }
      return;
    }

    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem('agrilink_token');
        const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.product) {
          const p = data.product;
          setFormData({
            name: p.p_name,
            category: p.p_category?.toString() ?? '1',
            price: p.p_price?.toString() ?? '',
            quantity: p.p_quantity?.toString() ?? '',
            unit: p.p_unit ?? 'kg',
            description: p.p_description ?? '',
            harvest_date: p.harvest_date ? p.harvest_date.split('T')[0] : ''
          });
          if (p.p_image) {
            const baseUrl = API_BASE_URL.replace('/api', '');
            setImagePreview(p.p_image.startsWith('http') ? p.p_image : `${baseUrl}${p.p_image}`);
          }
        } else {
          setError('Failed to load product.');
        }
      } catch {
        setError('Failed to fetch product details.');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [isOpen, productId, initialProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !productId) {
      console.error('Diagnostic: Missing required identifiers', { userId, productId });
      showError('System Error: Session or Product ID missing.');
      return;
    }

    console.log('Diagnostic: Starting Edit Submission', { productId, userId, formData });

    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = 'Crop name is required';

    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!formData.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (parseFloat(formData.quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.harvest_date) {
      errors.harvest_date = 'Required';
    } else {
      if (formData.harvest_date < getMinHarvestDate()) {
        errors.harvest_date = 'Must be tomorrow or later';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    console.log('Diagnostic: Validation Passed');

    // Check for changes
    const hasChanges = () => {
      if (!initialProduct) return true;
      const p = initialProduct;
      const initialHarvestDate = p.harvest_date ? p.harvest_date.split('T')[0] : '';

      return (
        formData.name !== p.p_name ||
        formData.category !== p.p_category?.toString() ||
        formData.price !== p.p_price?.toString() ||
        formData.quantity !== p.p_quantity?.toString() ||
        formData.unit !== p.p_unit ||
        formData.description !== p.p_description ||
        formData.harvest_date !== initialHarvestDate ||
        imageFile !== null
      );
    };

    if (!hasChanges()) {
      setLoading(false);
      showInfo('Nothing change');
      return;
    }

    try {
      const token = localStorage.getItem('agrilink_token');
      const data = new FormData();
      data.append('u_id', userId);
      data.append('p_name', formData.name);
      data.append('p_description', formData.description);
      data.append('p_price', formData.price);
      data.append('p_unit', formData.unit);
      data.append('p_quantity', formData.quantity);
      data.append('harvest_date', formData.harvest_date);
      data.append('p_category', formData.category);
      data.append('p_status', 'active');

      if (imageFile) {
        data.append('p_image', imageFile);
      } else if (initialProduct?.p_image) {
        data.append('p_image', initialProduct.p_image);
      }

      console.log('Diagnostic: Sending Update Request...');
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'The server encountered an issue while updating your listing.');
      }

      console.log('Diagnostic: Edit Success, triggering toast');
      setSuccess(true);
      showSuccess('Crop edited successfully!');
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Diagnostic: Edit Submission Failed', err);
      const errorMsg = err.message || 'Failed to update harvest listing.';
      console.log('Diagnostic: Triggering Error Toast with:', errorMsg);
      showError(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setFieldErrors({});
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-xl animate-fadeIn transition-all duration-700"
        onClick={handleClose}
      />

      <div className="relative bg-white/95 w-full max-w-6xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-scaleIn border border-white/50 overflow-hidden max-h-[90vh] flex flex-col">
        {/* 🎨 Header */}
        <div className="bg-white/80 backdrop-blur-md px-10 py-7 border-b border-gray-100 flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#5ba409] to-[#4d8f08] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-3.5 h-3.5 text-[#5ba409]" />
                <span className="text-[10px] font-black text-[#5ba409] uppercase tracking-[0.3em] italic">AgriLink Merchant Portal</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Edit Harvest Listing</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-12 h-12 hover:bg-gray-100 rounded-2xl transition-all active:scale-90 flex items-center justify-center group"
          >
            <X className="w-6 h-6 text-gray-300 group-hover:text-gray-500 transition-colors" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* 🖼️ Left Panel */}
          <div className="hidden lg:flex w-[38%] bg-slate-50/50 p-8 lg:p-10 border-r border-gray-100 flex-col justify-between overflow-hidden relative">
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#5ba409] rounded-full animate-pulse" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Listing Visuals</h3>
              </div>

              <div
                onClick={() => document.getElementById('edit-product-image-upload')?.click()}
                className="aspect-[4/3] relative rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center group hover:border-[#5ba409]/30 hover:shadow-xl hover:shadow-green-900/5 transition-all cursor-pointer shadow-sm"
              >
                <input
                  id="edit-product-image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-10">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 px-2 group-hover:scale-110 transition-transform duration-500">
                      <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-[#5ba409] transition-colors" />
                    </div>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                      Update Harvest <br /> Photos
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 bg-white/60 backdrop-blur-sm rounded-[1.5rem] border border-white shadow-sm flex items-start gap-4 transform hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-gray-900 uppercase italic tracking-tighter">Market Intelligence</p>
                  <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed uppercase tracking-widest">
                    Accurate photos and descriptions build trust with premium buyers.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <LayoutGrid className="w-4 h-4 text-[#5ba409]" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic tracking-tighter">Merchant Credentials</h3>
              </div>
              <div className="flex items-center gap-5 p-5 bg-white/40 rounded-3xl border border-white">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0 grayscale opacity-50" />
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase italic leading-none mb-1">Verified Producer</p>
                  <p className="text-[9px] text-[#5ba409] font-black uppercase tracking-widest italic leading-none">Security Level: Platinum</p>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 Right Panel */}
          <div className="flex-1 p-8 md:p-10 flex flex-col bg-white overflow-y-auto scrollbar-hide">
            {fetching ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
                <RefreshCcw className="w-12 h-12 text-[#5ba409] animate-spin" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Retrieving Harvest Data...</p>
              </div>
            ) : success ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-fadeIn space-y-8">
                <div className="w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#5ba409]/10 animate-pulse" />
                  <CheckCircle2 className="w-16 h-16 text-[#5ba409] relative z-10" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none mb-3">Update Success!</h2>
                  <p className="text-gray-400 font-bold text-sm italic uppercase tracking-widest">The marketplace has been synchronized with your changes.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1 italic leading-none">Crop Identifier</label>
                      <input
                        type="text" required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors(prev => {
                            const next = { ...prev };
                            delete next.name;
                            return next;
                          });
                        }}
                        className={`w-full bg-slate-50 border-2 ${fieldErrors.name ? 'border-red-200' : 'border-transparent'} focus:bg-white focus:border-[#5ba409] px-6 py-4.5 rounded-2xl font-black text-sm transition-all outline-none shadow-sm focus:shadow-xl focus:shadow-green-900/5`}
                      />
                      <div className="h-4 mt-1 ml-1">
                        {fieldErrors.name && (
                          <p className="text-red-500 text-[9px] font-black uppercase italic tracking-widest animate-in fade-in slide-in-from-top-1 duration-300">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1 italic leading-none">Trade Category</label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-slate-50/80 border-2 border-transparent focus:bg-white focus:border-[#5ba409] px-6 py-4.5 rounded-2xl font-black text-xs transition-all outline-none appearance-none cursor-pointer pr-12 shadow-sm italic uppercase hover:bg-slate-100/50"
                        >
                          <option value="1" className="font-black italic uppercase">Vegetables</option>
                          <option value="2" className="font-black italic uppercase">Fruits</option>
                          <option value="3" className="font-black italic uppercase">Grains</option>
                          <option value="4" className="font-black italic uppercase">Root Crops</option>
                          <option value="5" className="font-black italic uppercase">Others</option>
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 w-5 h-5 text-gray-300 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1 italic leading-none">Unit Valuation (₱)</label>
                      <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-300 text-sm group-focus-within:text-[#5ba409] transition-colors">₱</span>
                        <input
                          type="number" required
                          value={formData.price}
                          onChange={(e) => {
                            setFormData({ ...formData, price: e.target.value });
                            if (fieldErrors.price) setFieldErrors(prev => {
                              const next = { ...prev };
                              delete next.price;
                              return next;
                            });
                          }}
                          className={`w-full bg-slate-50 border-2 ${fieldErrors.price ? 'border-red-200' : 'border-transparent'} focus:bg-white focus:border-[#5ba409] pl-12 pr-6 py-4.5 rounded-2xl font-black text-sm transition-all outline-none shadow-sm`}
                        />
                      </div>
                      <div className="h-4 mt-1 ml-1">
                        {fieldErrors.price && (
                          <p className="text-red-500 text-[9px] font-black uppercase italic tracking-widest animate-in fade-in slide-in-from-top-1 duration-300">
                            {fieldErrors.price}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1 italic leading-none">Harvest Timeline</label>
                      <input
                        type="date" required
                        min={getMinHarvestDate()}
                        value={formData.harvest_date}
                        onChange={(e) => {
                          setFormData({ ...formData, harvest_date: e.target.value });
                          if (fieldErrors.harvest_date) setFieldErrors(prev => {
                            const next = { ...prev };
                            delete next.harvest_date;
                            return next;
                          });
                        }}
                        className={`w-full bg-slate-50 border-2 ${fieldErrors.harvest_date ? 'border-red-200' : 'border-transparent'} focus:bg-white focus:border-[#5ba409] px-6 py-4.5 rounded-2xl font-black text-sm transition-all outline-none shadow-sm uppercase`}
                      />
                      <div className="h-4 mt-1 ml-1">
                        {fieldErrors.harvest_date && (
                          <p className="text-red-500 text-[9px] font-black uppercase italic tracking-widest animate-in fade-in slide-in-from-top-1 duration-300">
                            {fieldErrors.harvest_date}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1 italic leading-none">Inventory & Packaging</label>
                      <div className="flex gap-4">
                        <input
                          type="number" required
                          value={formData.quantity}
                          onChange={(e) => {
                            setFormData({ ...formData, quantity: e.target.value });
                            if (fieldErrors.quantity) setFieldErrors(prev => {
                              const next = { ...prev };
                              delete next.quantity;
                              return next;
                            });
                          }}
                          className={`flex-1 bg-slate-50 border-2 ${fieldErrors.quantity ? 'border-red-200' : 'border-transparent'} focus:bg-white focus:border-[#5ba409] px-6 py-4.5 rounded-2xl font-black text-sm transition-all outline-none shadow-sm`}
                        />
                        <select
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-36 bg-slate-50/80 border-2 border-transparent focus:bg-white focus:border-[#5ba409] px-6 py-4.5 rounded-2xl font-black text-xs transition-all outline-none shadow-sm uppercase italic hover:bg-slate-100/50 cursor-pointer"
                        >
                          <option className="font-black italic uppercase">kg</option>
                          <option className="font-black italic uppercase">tray</option>
                          <option className="font-black italic uppercase">sack</option>
                          <option className="font-black italic uppercase">piece</option>
                        </select>
                      </div>
                      <div className="h-4 mt-1 ml-1">
                        {fieldErrors.quantity && (
                          <p className="text-red-500 text-[9px] font-black uppercase italic tracking-widest animate-in fade-in slide-in-from-top-1 duration-300">
                            {fieldErrors.quantity}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-1 italic leading-none">Market Narrative</label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#5ba409] px-8 py-6 rounded-[2rem] font-medium text-sm transition-all outline-none resize-none placeholder:text-gray-300 leading-relaxed shadow-sm block"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-5 pt-8 items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-br from-[#5ba409] to-[#4d8f08] hover:shadow-2xl hover:shadow-green-500/30 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 italic"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="animate-pulse">Authorizing Updates...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Save Harvest Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-gray-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 italic"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
