import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageSquare,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  User,
} from 'lucide-react';
import type { Product, ProductReview } from '../../../types';
import { API_BASE_URL, getFullImageUrl } from '../../../api/apiConfig';
import * as cartService from '../../../services/cartService';
import { useToast } from '../../ui/Toast';

type ProductRecord = {
  p_id?: number;
  p_name?: string;
  p_description?: string;
  p_price?: number | string;
  p_quantity?: number | string;
  p_unit?: string;
  p_image?: string;
  cat_name?: string;
  city?: string;
  first_name?: string;
  last_name?: string;
  u_id?: number | string;
  user_id?: number | string;
  farmer_id?: number | string;
  sellerAvgRating?: number | string;
  sellerReviewCount?: number | string;
};

type FarmerProfile = {
  id?: number;
  first_name?: string;
  last_name?: string;
  city?: string;
  farm_city?: string;
  farm_name?: string;
  farm_address?: string;
  address?: string;
};

const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const asText = (value: unknown, fallback = ''): string => {
  const out = String(value ?? '').trim();
  return out || fallback;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'farmer'>('overview');
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const token = localStorage.getItem('agrilink_token');

  useEffect(() => {
    let cancelled = false;

    const fetchProductData = async () => {
      try {
        setLoading(true);

        const productRes = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!productRes.ok) throw new Error('Product not found');

        const productData = (await productRes.json()) as { product?: ProductRecord };
        const nextProduct = productData.product ?? null;
        if (!cancelled) setProduct(nextProduct);

        const farmerId = toNumber(nextProduct?.u_id ?? nextProduct?.user_id ?? nextProduct?.farmer_id);
        if (farmerId > 0) {
          const farmerRes = await fetch(`${API_BASE_URL}/users/${farmerId}`);
          if (!cancelled) {
            if (farmerRes.ok) {
              const profile = (await farmerRes.json()) as FarmerProfile;
              setFarmerProfile(profile);
            } else {
              setFarmerProfile(null);
            }
          }
        } else if (!cancelled) {
          setFarmerProfile(null);
        }

        const reviewRes = await fetch(`${API_BASE_URL}/reviews/${id}`);
        if (!cancelled) {
          if (reviewRes.ok) {
            const reviewData = (await reviewRes.json()) as { reviews?: ProductReview[] };
            setReviews(Array.isArray(reviewData.reviews) ? reviewData.reviews : []);
          } else {
            setReviews([]);
          }
        }
      } catch {
        if (!cancelled) console.error('Unable to load product details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);

    return () => {
      cancelled = true;
    };
  }, [id]);

  const averageRating = useMemo(() => {
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + toNumber(r.rating), 0);
      return (sum / reviews.length).toFixed(1);
    }
    return toNumber(product?.sellerAvgRating, 0).toFixed(1);
  }, [product?.sellerAvgRating, reviews]);

  const reviewCount = useMemo(() => {
    if (reviews.length > 0) return reviews.length;
    return toNumber(product?.sellerReviewCount, 0);
  }, [product?.sellerReviewCount, reviews]);

  const ratingBreakdown = useMemo(
    () => [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: reviews.filter((r) => toNumber(r.rating) === s).length })),
    [reviews]
  );

  const handleAddReview = async () => {
    if (!token) {
      showInfo('Sign in to submit a review.');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          rating: newRating,
          comment: newComment.trim(),
        }),
      });

      if (!res.ok) {
        showError('Failed to submit review.');
        return;
      }

      showSuccess('Review submitted.');
      setNewComment('');
      const reviewRes = await fetch(`${API_BASE_URL}/reviews/${id}`);
      if (reviewRes.ok) {
        const reviewData = (await reviewRes.json()) as { reviews?: ProductReview[] };
        setReviews(Array.isArray(reviewData.reviews) ? reviewData.reviews : []);
      }
    } catch {
      showError('Network error while submitting review.');
    }
  };

  const handleChatFarmer = () => {
    if (!token) {
      showInfo('Please log in to message the farmer.');
      navigate('/login');
      return;
    }

    const farmerId = toNumber(product?.u_id ?? farmerProfile?.id);
    const myId = toNumber(localStorage.getItem('agrilink_id'));

    if (farmerId <= 0) {
      showError('Farmer profile is unavailable.');
      return;
    }

    if (myId > 0 && myId === farmerId) {
      showInfo('This is your own listing.');
      return;
    }

    const productName = asText(product?.p_name, 'your listing');
    const farmerName = asText(
      `${asText(farmerProfile?.first_name)} ${asText(farmerProfile?.last_name)}`,
      asText(`${asText(product?.first_name)} ${asText(product?.last_name)}`, 'Farmer')
    );

    const starter = `Hi ${farmerName}, I'm interested in ${productName}. Is it still available?`;

    const params = new URLSearchParams({
      contactId: String(farmerId),
      startConversation: '1',
      productId: String(toNumber(product?.p_id)),
      productName,
      starter,
    });

    navigate(`/messages?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-green-600 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = getFullImageUrl(product.p_image);
  const name = asText(product.p_name, 'Unnamed Product');
  const category = asText(product.cat_name, 'Uncategorized');
  const price = toNumber(product.p_price, 0);
  const unit = asText(product.p_unit, 'unit');
  const stock = toNumber(product.p_quantity, 0);
  const isOutOfStock = stock <= 0;
  const location = asText(product.city, 'Location not provided');

  const farmerName = asText(
    `${asText(farmerProfile?.first_name)} ${asText(farmerProfile?.last_name)}`,
    asText(`${asText(product.first_name)} ${asText(product.last_name)}`, 'Farmer')
  );
  const farmerCity = asText(farmerProfile?.farm_city ?? farmerProfile?.city, location);
  const farmerId = toNumber(product.u_id ?? farmerProfile?.id);
  const isOwnListing = toNumber(localStorage.getItem('agrilink_id')) === farmerId && farmerId > 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-4">
          <button onClick={() => navigate('/buyer/marketplace')} className="hover:text-slate-700">Marketplace</button>
          <ChevronRight size={14} />
          <span>{category}</span>
          <ChevronRight size={14} />
          <span className="text-slate-700 truncate">{name}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-[420px_1fr]">
            <div className="p-5 border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="aspect-square rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package size={56} />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-[11px] font-semibold mb-3">
                    <CheckCircle2 size={13} /> {category}
                  </p>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">{name}</h1>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.round(toNumber(averageRating)) ? 'fill-current' : ''} />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-800">{averageRating}</span>
                  <span>({reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>{location}</span>
                </div>
              </div>

              <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Price</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">P {price.toLocaleString()}</p>
                <p className="text-sm text-slate-500">per {unit}</p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Available</p>
                  <p className="font-semibold text-slate-800">{stock.toLocaleString()} {unit}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Quantity</p>
                  <div className="mt-1 inline-flex items-center rounded-lg border border-slate-200 overflow-hidden">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 grid place-items-center text-slate-600 hover:bg-slate-50">
                      <Minus size={14} />
                    </button>
                    <span className="w-11 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(stock || 1, q + 1))} className="w-9 h-9 grid place-items-center text-slate-600 hover:bg-slate-50">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const pObj: Product = {
                      id: toNumber(product.p_id),
                      name,
                      price,
                      unit,
                      seller: farmerName,
                      sellerUserId: farmerId > 0 ? farmerId : undefined,
                      location,
                      stock,
                      image: imageUrl,
                      category,
                    };
                    cartService.addToCart(pObj, qty);
                    showSuccess(`${name} added to cart.`);
                  }}
                  disabled={isOutOfStock}
                  className="h-11 px-5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold inline-flex items-center gap-2"
                >
                  <ShoppingCart size={16} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleChatFarmer}
                  disabled={isOwnListing}
                  className="h-11 px-5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-700 text-sm font-semibold inline-flex items-center gap-2"
                >
                  <MessageSquare size={16} /> {isOwnListing ? 'Your Listing' : 'Message Farmer'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 grid place-items-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{farmerName}</p>
              <p className="text-xs text-slate-500">{farmerCity}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Farm Name</p>
              <p className="font-medium text-slate-800">{asText(farmerProfile?.farm_name, 'Not provided')}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Farm Address</p>
              <p className="font-medium text-slate-800">{asText(farmerProfile?.farm_address ?? farmerProfile?.address, 'Not provided')}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-4">
            {(['overview', 'reviews', 'farmer'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-12 px-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? 'text-green-700 border-green-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'reviews' ? `Reviews (${reviewCount})` : 'Farmer'}
              </button>
            ))}
          </div>

          <div className="p-5 lg:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Description</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {asText(product.p_description, 'No description provided for this product yet.')}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Category</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{category}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Unit</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{unit}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-slate-900">{averageRating}</span>
                    <span className="text-sm text-slate-500">/ 5</span>
                  </div>
                  <div className="space-y-2">
                    {ratingBreakdown.map((row) => {
                      const pct = reviews.length > 0 ? (row.count / reviews.length) * 100 : 0;
                      return (
                        <div key={row.stars} className="flex items-center gap-3">
                          <span className="w-10 text-xs text-slate-500">{row.stars}?</span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-right text-xs text-slate-500">{row.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {token && (
                  <div className="rounded-xl border border-slate-100 p-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-800">Write a review</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button key={s} onClick={() => setNewRating(s)} className="text-amber-500">
                          <Star size={18} className={s <= newRating ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience with this product"
                      className="w-full h-28 rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-green-200"
                    />
                    <button
                      onClick={handleAddReview}
                      disabled={!newComment.trim()}
                      className="h-10 px-4 rounded-lg bg-slate-900 hover:bg-green-700 disabled:bg-slate-300 text-white text-sm font-semibold"
                    >
                      Submit Review
                    </button>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                    No reviews yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-xl border border-slate-100 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{asText(`${review.first_name} ${review.last_name}`, 'Anonymous')}</p>
                            <div className="mt-1 flex items-center gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < review.rating ? 'fill-current' : ''} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="mt-3 text-sm text-slate-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'farmer' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Name</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{farmerName}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">City</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{farmerCity}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">Farm Address</p>
                  <p className="text-sm font-medium text-slate-800">{asText(farmerProfile?.farm_address ?? farmerProfile?.address, 'Not provided')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-2">
          <button
            onClick={handleChatFarmer}
            disabled={isOwnListing}
            className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <MessageSquare size={14} /> Message
          </button>
          <button
            onClick={() => {
              const pObj: Product = {
                id: toNumber(product.p_id),
                name,
                price,
                unit,
                seller: farmerName,
                sellerUserId: farmerId > 0 ? farmerId : undefined,
                location,
                stock,
                image: imageUrl,
                category,
              };
              cartService.addToCart(pObj, qty);
              showSuccess(`${name} added to cart.`);
            }}
            disabled={isOutOfStock}
            className="h-10 px-3 rounded-lg bg-green-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:bg-slate-300"
          >
            <ShoppingCart size={14} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <div className="ml-auto text-right">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">Price</p>
            <p className="text-sm font-semibold text-slate-900">P {price.toLocaleString()} / {unit}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
