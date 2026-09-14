import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onCheckout }) {
  const {
    items,
    totalItemsCount,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    coupon,
    couponError,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    applyCoupon(couponInput);
  };

  const handleQuickCoupon = (code) => {
    setCouponInput(code);
    applyCoupon(code);
  };

  const freeShippingThreshold = 499;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="drawer-backdrop" onClick={closeCart}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 500 }}>
              Your Bag
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '12px 24px',
          background: 'var(--bg-surface-muted)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {amountNeeded === 0 ? '✨ You have unlocked FREE Shipping!' : `Add ₹${amountNeeded} more for FREE shipping`}
            </span>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{progressPercent}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '5px',
            background: 'rgba(201, 169, 110, 0.18)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-gold) 0%, #1A3D20 100%)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              <span style={{ fontSize: '3rem', marginBottom: '16px' }}>🌿</span>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '240px', marginBottom: '24px' }}>
                Explore authentic handmade Ayurvedic remedies crafted with ancient wisdom.
              </p>
              <button onClick={closeCart} className="btn-secondary">
                Explore Formulations
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    background: 'var(--bg-surface-muted)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    position: 'relative'
                  }}
                >
                  {/* Item Image */}
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#FAF7F2',
                    flexShrink: 0,
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}>
                    <img
                      src={item.image ? `/assets/${item.image}` : '/assets/logo.jpg'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.2 }}>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-muted)', padding: '2px'
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                        {item.weight || 'Standard size'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      {/* Qty Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        padding: '3px 8px'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <span style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        color: 'var(--accent-gold)'
                      }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-surface)'
          }}>
            {/* Promo Code Input */}
            <div style={{ marginBottom: '14px' }}>
              {coupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--accent-gold-light)',
                  border: '1px solid var(--accent-gold-border)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)' }}>
                    <Tag size={15} />
                    <span><strong>{coupon.code}</strong> applied (-₹{coupon.discount_amount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Coupon (e.g. FIRST10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        background: 'var(--bg-surface-muted)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'var(--accent-gold-light)',
                        border: '1px solid var(--accent-gold-border)',
                        color: 'var(--accent-gold)',
                        padding: '0 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-crimson)', marginTop: '4px', display: 'block' }}>
                      {couponError}
                    </span>
                  )}
                  {/* Quick Coupon Chips */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleQuickCoupon('FIRST10')}
                      style={{
                        background: 'none',
                        border: '1px dashed var(--accent-gold)',
                        borderRadius: '20px',
                        padding: '3px 8px',
                        fontSize: '0.68rem',
                        color: 'var(--accent-gold)',
                        cursor: 'pointer'
                      }}
                    >
                      FIRST10 (10% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickCoupon('AYURVEDA20')}
                      style={{
                        background: 'none',
                        border: '1px dashed var(--accent-gold)',
                        borderRadius: '20px',
                        padding: '3px 8px',
                        fontSize: '0.68rem',
                        color: 'var(--accent-gold)',
                        cursor: 'pointer'
                      }}
                    >
                      AYURVEDA20 (20% OFF)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Standard Delivery</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '1.3rem' }}>
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                closeCart();
                onCheckout();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '16px 0', fontSize: '0.88rem' }}
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              <ShieldCheck size={14} color="var(--accent-gold)" />
              <span>100% Genuine Ayurvedic Batches · Secured Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
