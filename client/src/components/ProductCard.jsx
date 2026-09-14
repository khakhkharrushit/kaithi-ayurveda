import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart } = useCart();

  const primaryImage = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : (typeof product.images === 'string' ? product.images : '');

  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="luxury-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Image Container with Badges */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%', // 1:1 Aspect ratio
          overflow: 'hidden',
          background: 'var(--bg-surface-muted)',
          cursor: 'pointer'
        }}
        onClick={() => onSelectProduct(product.id)}
      >
        <img
          src={primaryImage ? `/assets/${primaryImage}` : '/assets/logo.jpg'}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
        />

        {/* Badge Overlay */}
        {product.badge && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2
          }}>
            <span className={product.badge.toLowerCase().includes('bestseller') ? 'badge-gold' : 'badge-forest'}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          zIndex: 2
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product.id);
            }}
            title="View Details"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(201, 169, 110, 0.4)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Category & Weight */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              fontWeight: 600
            }}>
              {product.category}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {product.weight}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onSelectProduct(product.id)}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.28rem',
              fontWeight: 500,
              lineHeight: 1.25,
              marginBottom: '8px',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.short_desc}
          </p>

          {/* Rating or New Batch Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', minHeight: '18px' }}>
            {product.reviews_count > 0 ? (
              <>
                <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {product.rating} ({product.reviews_count} {product.reviews_count === 1 ? 'review' : 'reviews'})
                </span>
              </>
            ) : (
              <span style={{
                fontSize: '0.74rem',
                color: 'var(--accent-gold)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500
              }}>
                🌿 Fresh Artisan Batch
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.55rem',
              fontWeight: 600,
              color: 'var(--accent-gold)'
            }}>
              ₹{product.price}
            </span>
            {hasDiscount && (
              <>
                <span style={{
                  fontSize: '0.85rem',
                  textDecoration: 'line-through',
                  color: 'var(--text-muted)'
                }}>
                  ₹{product.mrp}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  color: 'var(--accent-sage)',
                  fontWeight: 600
                }}>
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '11px 0',
              fontSize: '0.78rem',
              borderRadius: '24px'
            }}
          >
            <ShoppingBag size={15} /> Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
