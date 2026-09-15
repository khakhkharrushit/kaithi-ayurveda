import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle, Sparkles, Heart, Package, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FeedbackModal({ isOpen, onClose, orderNumber }) {
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [ratings, setRatings] = useState({}); // { [productId]: number }
  const [comments, setComments] = useState({}); // { [productId]: string }
  const [generalRating, setGeneralRating] = useState(5);
  const [generalComment, setGeneralComment] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState({});

  useEffect(() => {
    if (user?.name && !authorName) {
      setAuthorName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && orderNumber) {
      setLoadingOrder(true);
      fetch(`/api/orders/${orderNumber}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setOrderDetails(data);
            if (data.customer_name && !authorName) {
              setAuthorName(data.customer_name);
            }
            // Initialize ratings
            const initR = {};
            const initC = {};
            if (data.items && data.items.length) {
              data.items.forEach(item => {
                const pId = item.product_id;
                initR[pId] = 5;
                initC[pId] = '';
              });
            }
            setRatings(initR);
            setComments(initC);
          }
        })
        .catch(err => console.warn('Could not load order for feedback:', err))
        .finally(() => setLoadingOrder(false));
    }
  }, [isOpen, orderNumber]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      if (orderDetails?.items?.length) {
        // Submit review for each product in order
        for (const item of orderDetails.items) {
          const pId = item.product_id;
          const rating = ratings[pId] || 5;
          const comment = comments[pId]?.trim() || `Purchased in order ${orderNumber}. Exceptional Ayurvedic quality!`;
          await fetch(`/api/products/${pId}/reviews`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              user_name: authorName || user?.name || 'Ayurvedic Customer',
              rating,
              comment
            })
          });
        }
      } else {
        // General review for flagship product (ID 1 - Maha Bringhraj Oil)
        await fetch(`/api/products/1/reviews`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            user_name: authorName || user?.name || 'Verified Customer',
            rating: generalRating,
            comment: generalComment || 'Wonderful healing experience with Kaithi Ayurveda!'
          })
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Failed submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating, onRate, pKey) => {
    const activeHover = hoverRating[pKey] || 0;
    return (
      <div style={{ display: 'flex', gap: '6px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoverRating(prev => ({ ...prev, [pKey]: star }))}
            onMouseLeave={() => setHoverRating(prev => ({ ...prev, [pKey]: 0 }))}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              transition: 'transform 0.15s ease'
            }}
          >
            <Star
              size={24}
              style={{
                fill: star <= (activeHover || currentRating) ? '#C9A96E' : 'transparent',
                color: star <= (activeHover || currentRating) ? '#C9A96E' : 'var(--text-muted, #8C9985)',
                transition: 'all 0.15s ease'
              }}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-card, #0D1F12)',
        border: '1px solid rgba(201, 169, 110, 0.35)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        color: 'var(--text-main, #F5EFEB)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(201,169,110,0.2)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted, #8C9985)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(91, 191, 116, 0.15)',
              border: '2px solid #5BBF74',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#5BBF74'
            }}>
              <Heart size={36} />
            </div>
            <h3 style={{ fontSize: '24px', color: '#C9A96E', margin: '0 0 10px', fontFamily: 'serif' }}>
              Namaste & Thank You! 🙏
            </h3>
            <p style={{ color: 'var(--text-muted, #A3B899)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>
              Your valued experience and feedback has been received. Your blessing inspires Dr. Nidhi and our team to continue handcrafting pure ancient Ayurvedic formulations.
            </p>
            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #C9A96E 0%, #B08B48 100%)',
                color: '#0D1F12',
                border: 'none',
                fontWeight: 'bold',
                padding: '12px 32px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                letterSpacing: '1px'
              }}
            >
              Back to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '36px 32px 28px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(201, 169, 110, 0.1)',
                border: '1px solid rgba(201, 169, 110, 0.3)',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#C9A96E',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '10px'
              }}>
                <Sparkles size={13} /> Customer Feedback
              </div>
              <h2 style={{ fontSize: '24px', margin: '0 0 6px', color: '#F5EFEB', fontFamily: 'serif' }}>
                Share Your Experience
              </h2>
              {orderNumber && (
                <div style={{ fontSize: '13px', color: '#C9A96E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Package size={14} /> Order #{orderNumber}
                </div>
              )}
            </div>

            {/* Author Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted, #8C9985)', marginBottom: '6px' }}>
                Your Name
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(201, 169, 110, 0.25)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#F5EFEB',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Product Reviews or General */}
            {orderDetails?.items?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted, #A3B899)', fontWeight: 'bold' }}>
                  Rate your purchased herbal formulations:
                </div>
                {orderDetails.items.map((item) => {
                  const pId = item.product_id;
                  return (
                    <div
                      key={item.id || pId}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(201, 169, 110, 0.15)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#F5EFEB' }}>
                          {item.product_name}
                        </span>
                        {renderStars(ratings[pId] || 5, (val) => setRatings(prev => ({ ...prev, [pId]: val })), `p_${pId}`)}
                      </div>
                      <textarea
                        rows={2}
                        placeholder="How did this product feel? (Aroma, texture, effectiveness...)"
                        value={comments[pId] || ''}
                        onChange={(e) => setComments(prev => ({ ...prev, [pId]: e.target.value }))}
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.25)',
                          border: '1px solid rgba(201, 169, 110, 0.2)',
                          borderRadius: '8px',
                          padding: '10px',
                          color: '#F5EFEB',
                          fontSize: '13px',
                          resize: 'none',
                          boxSizing: 'border-box',
                          outline: 'none'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted, #8C9985)' }}>
                    Overall Rating
                  </label>
                  {renderStars(generalRating, setGeneralRating, 'gen')}
                </div>
                <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted, #8C9985)', marginBottom: '6px' }}>
                  Your Review / Experience
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your experience with Kaithi Ayurveda formulations..."
                  value={generalComment}
                  onChange={(e) => setGeneralComment(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(201, 169, 110, 0.25)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    color: '#F5EFEB',
                    fontSize: '14px',
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #C9A96E 0%, #B08B48 100%)',
                color: '#0D1F12',
                border: 'none',
                fontWeight: 'bold',
                padding: '14px',
                borderRadius: '12px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: submitting ? 0.7 : 1,
                boxShadow: '0 4px 15px rgba(201, 169, 110, 0.2)'
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review 🙏'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
