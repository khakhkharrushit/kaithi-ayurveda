import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Check, Heart, Sparkles, MessageCircle, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage({ productId, onBack, onCheckout }) {
  const { addToCart } = useCart();
  const { user, openAuthModal } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      setProduct(data);
    } catch (e) {
      console.error('Failed to load product detail', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      onCheckout();
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('kaithi_token')}` } : {})
        },
        body: JSON.stringify({
          rating: reviewRating,
          user_name: reviewName || user?.name || 'Ayurvedic Enthusiast',
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (res.ok) {
        setReviewMessage('Your review has been published! Thank you.');
        setReviewComment('');
        fetchProductDetail();
        setTimeout(() => setReviewMessage(''), 5000);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '160px 0 100px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-muted)' }}>
          Unfolding formulation details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '160px 0 100px', textAlign: 'center' }}>
        <h2>Formulation not found</h2>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: '20px' }}>
          Return to Sanctuary
        </button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['logo.jpg'];
  const activeImage = images[activeImageIndex] || images[0];

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const waMsg = encodeURIComponent(`Hi Dr. Nidhi! I would like to order the ${product.name} (${product.weight || ''}) priced at ₹${product.price}.`);

  return (
    <div style={{ padding: '120px 0 80px' }}>
      <div className="container">
        {/* Back navigation */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.84rem',
            cursor: 'pointer',
            marginBottom: '30px',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> Back to Formulations
        </button>

        {/* Product Detail Layout (2 Columns) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '50px',
          marginBottom: '70px'
        }}>
          {/* Left Column: Image Gallery */}
          <div>
            {/* Main Stage Image */}
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'var(--bg-surface-muted)',
              border: '1px solid var(--border-color)',
              height: '480px',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img
                src={`/assets/${activeImage}`}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
                onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
              />

              {product.badge && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className={product.badge.toLowerCase().includes('bestseller') ? 'badge-gold' : 'badge-forest'}>
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: idx === activeImageIndex ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: 'var(--bg-surface-muted)',
                      padding: 0,
                      opacity: idx === activeImageIndex ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={`/assets/${img}`}
                      alt={`${product.name} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div>
            {/* Category & Weight */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span className="badge-gold">{product.category}</span>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {product.weight} · Inclusive of all taxes
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: '14px',
              color: 'var(--text-primary)'
            }}>
              {product.name}
            </h1>

            {/* Rating Stars or Batch Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
              {product.reviews_count > 0 ? (
                <>
                  <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    <strong>{product.rating}</strong> ({product.reviews_count} {product.reviews_count === 1 ? 'verified review' : 'verified reviews'})
                  </span>
                </>
              ) : (
                <span style={{
                  fontSize: '0.84rem',
                  color: 'var(--accent-gold)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                  background: 'var(--accent-gold-light)',
                  border: '1px solid var(--accent-gold-border)',
                  padding: '4px 12px',
                  borderRadius: '16px'
                }}>
                  🌿 100% Pure Handmade Batch · Kodinar
                </span>
              )}
            </div>

            {/* Price Box */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '14px',
              marginBottom: '26px',
              padding: '16px 20px',
              background: 'var(--bg-surface-muted)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              width: 'fit-content'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.4rem',
                fontWeight: 600,
                color: 'var(--accent-gold)'
              }}>
                ₹{product.price}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    ₹{product.mrp}
                  </span>
                  <span style={{ fontSize: '0.84rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p style={{
              fontSize: '0.96rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: '28px'
            }}>
              {product.description}
            </p>

            {/* Quantity Selector & Action CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '22px' }}>
              {/* Qty */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '30px',
                padding: '6px 14px',
                gap: '12px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  -
                </button>
                <span style={{ fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, minWidth: '180px', padding: '16px 24px' }}
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>

              {/* Buy Now (Direct Checkout) */}
              <button
                onClick={handleBuyNow}
                className="btn-forest"
                style={{
                  padding: '16px 28px',
                  borderRadius: '40px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* WhatsApp Order Option */}
            <a
              href={`https://wa.me/919428704882?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '30px',
                border: '1px solid #25D366',
                color: '#25D366',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '32px'
              }}
            >
              <MessageCircle size={17} /> Order via WhatsApp Direct
            </a>

            {/* Sacred Ingredients Pills */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div style={{ marginBottom: '26px' }}>
                <h4 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.74rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  marginBottom: '10px'
                }}>
                  Key Botanical Ingredients
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'var(--bg-surface-muted)',
                        border: '1px solid var(--border-color)',
                        padding: '5px 14px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      🌿 {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Proven Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div style={{ marginBottom: '26px' }}>
                <h4 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.74rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  marginBottom: '10px'
                }}>
                  Therapeutic Benefits
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.benefits.map((benefit, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <Check size={16} color="var(--accent-sage)" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How It's Made */}
            {product.how_made && (
              <div style={{
                padding: '20px 24px',
                background: 'var(--bg-surface-muted)',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                marginBottom: '26px'
              }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  🏺 How It's Prepared
                </span>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.08rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  marginTop: '8px'
                }}>
                  {product.how_made}
                </p>
              </div>
            )}

            {/* Video Preview if present */}
            {product.video_url && (
              <div style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  🎬 Watch The Artisan Formulation
                </span>
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '260px' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={product.video_url}
                    title={product.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews & Submit Section */}
        <section style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '60px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
            <div>
              <span className="luxury-subtitle">Community Experiences</span>
              <h2 className="luxury-title" style={{ marginTop: '4px' }}>
                Verified Patron Reviews
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600 }}>
                {product.rating} out of 5
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px'
          }}>
            {/* Reviews List */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {(!product.reviews_list || product.reviews_list.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)' }}>No customer reviews yet. Be the first to share your experience!</p>
                ) : (
                  product.reviews_list.map((rev, index) => (
                    <div
                      key={index}
                      className="luxury-card"
                      style={{ padding: '20px 24px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>{rev.user_name}</strong>
                          {rev.verified_buyer && (
                            <span style={{ fontSize: '0.68rem', color: 'var(--accent-sage)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <ShieldCheck size={12} /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Leave a Review Form */}
            <div className="luxury-card" style={{ padding: '28px', height: 'fit-content' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', marginBottom: '6px' }}>
                Share Your Experience
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Have you experienced this formulation? Help fellow Ayurvedic seekers with your review.
              </p>

              {reviewMessage && (
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--accent-forest-light)',
                  border: '1px solid var(--accent-sage)',
                  color: 'var(--accent-sage)',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  marginBottom: '16px'
                }}>
                  {reviewMessage}
                </div>
              )}

              <form onSubmit={handleReviewSubmit}>
                {/* Star Rating Picker */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Your Rating</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: star <= reviewRating ? 'var(--accent-gold)' : 'var(--text-muted)',
                          padding: '4px'
                        }}
                      >
                        <Star size={22} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {!user && (
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Anjali Dave"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Your Review *</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Describe how the formulation felt on your skin or hair..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px 0' }}
                >
                  <Send size={15} /> {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
