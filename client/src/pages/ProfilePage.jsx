import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, CheckCircle, Clock, FileText, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ onViewOrderInvoice, onContinueShopping, onLeaveFeedback }) {
  const { user, token, updateProfile, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address edit state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setPincode(user.pincode || '');
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load user orders', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    try {
      await updateProfile({ name, phone, address, city, state, pincode });
      setSaveMessage('Profile and address updated successfully!');
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err) {
      setSaveMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '160px 0 100px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '14px' }}>
          Customer Account Sanctuary
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Sign in to view your order history, tracking statuses, and saved addresses.
        </p>
        <button onClick={() => openAuthModal('login')} className="btn-primary">
          Sign In to Your Account
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '120px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '36px' }}>
          <span className="luxury-subtitle">Customer Portal</span>
          <h1 className="luxury-title" style={{ marginTop: '4px' }}>
            Namaste, {user.name.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage your saved shipping details and track your handcrafted orders.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Profile & Address Form */}
          <div className="luxury-card" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--accent-gold)" /> Saved Shipping Information
            </h3>

            {saveMessage && (
              <div style={{
                padding: '10px 14px',
                background: 'var(--accent-forest-light)',
                border: '1px solid var(--accent-sage)',
                color: 'var(--accent-sage)',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '16px'
              }}>
                {saveMessage}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="form-input"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street / Apartment Address</label>
                <input
                  type="text"
                  placeholder="Flat No, Building Name, Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ width: '100%', marginTop: '6px' }}
              >
                {saving ? 'Saving Changes...' : 'Update Details'}
              </button>
            </form>
          </div>

          {/* Right Column: Order History */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Package size={20} color="var(--accent-gold)" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem' }}>
                Your Order Chronicles ({orders.length})
              </h3>
            </div>

            {loadingOrders ? (
              <p style={{ color: 'var(--text-muted)' }}>Retrieving your order chronicles...</p>
            ) : orders.length === 0 ? (
              <div className="luxury-card" style={{ padding: '36px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '18px' }}>
                  You haven't placed an order yet. Begin your Ayurvedic ritual today!
                </p>
                <button onClick={onContinueShopping} className="btn-secondary">
                  Explore Formulations
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {orders.map(order => (
                  <div key={order.id} className="luxury-card" style={{ padding: '22px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '14px',
                      marginBottom: '14px'
                    }}>
                      <div>
                        <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--accent-gold)' }}>
                          {order.order_number}
                        </strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block' }}>
                          Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: order.order_status === 'Delivered' 
                            ? 'var(--accent-forest-light)' 
                            : order.order_status === 'Cancelled'
                            ? 'rgba(155, 44, 59, 0.12)'
                            : order.order_status === 'Shipped'
                            ? 'rgba(42, 90, 150, 0.12)'
                            : 'var(--accent-gold-light)',
                          color: order.order_status === 'Delivered' 
                            ? 'var(--accent-sage)' 
                            : order.order_status === 'Cancelled'
                            ? 'var(--accent-crimson)'
                            : order.order_status === 'Shipped'
                            ? '#3B82F6'
                            : 'var(--accent-gold)'
                        }}>
                          {order.order_status}
                        </span>
                        <strong style={{ display: 'block', fontSize: '1.05rem', marginTop: '4px' }}>
                          ₹{order.total_amount}
                        </strong>
                      </div>
                    </div>

                    {/* Tracking details if available */}
                    {order.tracking_number && (
                      <div style={{
                        padding: '8px 12px',
                        background: 'var(--accent-gold-light)',
                        border: '1px solid var(--accent-gold-border)',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>🚚 Courier Tracking: <strong>{order.tracking_number}</strong></span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>In Transit</span>
                      </div>
                    )}

                    {/* Order items list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {order.items && order.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                          <span>{it.quantity}x {it.product_name}</span>
                          <span style={{ color: 'var(--text-muted)' }}>₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action: View invoice & Feedback */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => onViewOrderInvoice(order)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '9px 0', fontSize: '0.78rem' }}
                      >
                        <FileText size={14} /> Tax Invoice
                      </button>
                      {onLeaveFeedback && (
                        <button
                          onClick={() => onLeaveFeedback(order.order_number)}
                          className="btn-secondary"
                          style={{
                            flex: 1,
                            padding: '9px 0',
                            fontSize: '0.78rem',
                            borderColor: 'var(--accent-gold-border, rgba(201,169,110,0.3))',
                            color: 'var(--accent-gold, #C9A96E)'
                          }}
                        >
                          <Star size={14} /> Review Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
