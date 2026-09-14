import React, { useState, useEffect } from 'react';
import { Shield, Package, TrendingUp, Users, Clock, CheckCircle2, Truck, RefreshCw, FileText, Lock, Mail, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminPage({ onViewOrderInvoice, onBackToStore }) {
  const { user, token, isAdmin, login, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [trackingInputs, setTrackingInputs] = useState({});

  // Dedicated Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAdminAuthError('');
    setAdminAuthLoading(true);
    try {
      const loggedUser = await login(adminEmail, adminPassword);
      if (loggedUser.role !== 'admin') {
        throw new Error('This account does not have administrative privileges.');
      }
    } catch (err) {
      setAdminAuthError(err.message || 'Admin authentication failed');
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/orders/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);

        // Prepopulate tracking inputs
        const initialTracking = {};
        ordersData.forEach(o => {
          initialTracking[o.id] = o.tracking_number || '';
        });
        setTrackingInputs(initialTracking);
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          order_status: newStatus,
          tracking_number: trackingInputs[orderId] || null
        })
      });

      if (res.ok) {
        // Refresh local orders
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      }
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveTracking = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const currentOrder = orders.find(o => o.id === orderId);
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          order_status: currentOrder ? currentOrder.order_status : 'Shipped',
          tracking_number: trackingInputs[orderId]
        })
      });
      alert('Tracking number updated!');
    } catch (e) {
      alert('Failed to update tracking');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="container" style={{ padding: '160px 0 100px', display: 'flex', justifyContent: 'center' }}>
        <div className="luxury-card" style={{ padding: '44px 36px', maxWidth: '460px', width: '100%', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-gold-light)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-gold)',
            marginBottom: '16px'
          }}>
            <Shield size={32} />
          </div>
          <span className="luxury-subtitle">Staff & Management</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', margin: '6px 0 12px' }}>
            Kaithi Staff Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Access restricted to authorized Kaithi Ayurveda personnel.
          </p>

          {adminAuthError && (
            <div style={{
              background: 'rgba(155, 44, 59, 0.1)',
              border: '1px solid rgba(155, 44, 59, 0.3)',
              color: 'var(--accent-crimson)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '18px',
              textAlign: 'left'
            }}>
              {adminAuthError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label className="form-label">Staff Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="admin@kaithi.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminAuthLoading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '10px', padding: '14px', opacity: adminAuthLoading ? 0.7 : 1 }}
            >
              {adminAuthLoading ? 'Authenticating Staff...' : 'Sign In to Admin Portal'}
            </button>
          </form>

          {onBackToStore && (
            <button
              onClick={onBackToStore}
              style={{
                marginTop: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} /> Return to Boutique Store
            </button>
          )}
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'All') return true;
    return o.order_status === statusFilter;
  });

  return (
    <div style={{ padding: '120px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--accent-gold)" />
              <span className="luxury-subtitle">Store Command Center</span>
            </div>
            <h1 className="luxury-title" style={{ marginTop: '4px' }}>
              Kaithi Administration
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={loadAdminData}
              className="btn-secondary"
              style={{ padding: '9px 16px', fontSize: '0.78rem' }}
            >
              <RefreshCw size={14} /> Refresh Data
            </button>
            {onBackToStore && (
              <button
                onClick={onBackToStore}
                className="btn-secondary"
                style={{ padding: '9px 16px', fontSize: '0.78rem' }}
              >
                <ArrowLeft size={14} /> View Store
              </button>
            )}
            <button
              onClick={() => {
                logout();
                if (onBackToStore) onBackToStore();
              }}
              style={{
                background: 'rgba(155, 44, 59, 0.1)',
                border: '1px solid rgba(155, 44, 59, 0.3)',
                color: 'var(--accent-crimson)',
                padding: '9px 16px',
                borderRadius: '30px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 500
              }}
            >
              <LogOut size={14} /> Logout Staff
            </button>
          </div>
        </div>

        {/* Overview Stat Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div className="luxury-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span>Total Revenue</span>
                <TrendingUp size={16} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--accent-gold)' }}>
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </h3>
            </div>

            <div className="luxury-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span>Total Orders</span>
                <Package size={16} color="var(--accent-sage)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
                {stats.totalOrders}
              </h3>
            </div>

            <div className="luxury-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span>Pending Fulfillment</span>
                <Clock size={16} color="var(--accent-crimson)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--accent-crimson)' }}>
                {stats.pendingOrders}
              </h3>
            </div>

            <div className="luxury-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span>Active Formulations</span>
                <Package size={16} color="var(--accent-gold)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
                {stats.totalProducts}
              </h3>
            </div>
          </div>
        )}

        {/* Orders Management Table */}
        <div className="luxury-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
              Live Order Pipeline
            </h3>

            {/* Status Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['All', 'Placed', 'Processing', 'Shipped', 'Delivered'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    background: statusFilter === status ? 'var(--accent-gold)' : 'var(--bg-surface-muted)',
                    color: statusFilter === status ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders in this status.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Ref #</th>
                    <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Customer & Destination</th>
                    <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Items</th>
                    <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Tracking #</th>
                    <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Fulfillment Status</th>
                    <th style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {/* Ref */}
                      <td style={{ padding: '14px 10px' }}>
                        <strong style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '1.05rem', display: 'block' }}>
                          {order.order_number}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '14px 10px' }}>
                        <strong style={{ display: 'block' }}>{order.customer_name}</strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'block' }}>
                          {order.city}, {order.state} · {order.customer_phone}
                        </span>
                      </td>

                      {/* Items */}
                      <td style={{ padding: '14px 10px' }}>
                        <span style={{ fontSize: '0.8rem' }}>
                          {order.items?.map(it => `${it.quantity}x ${it.product_name}`).join(', ')}
                        </span>
                      </td>

                      {/* Amount & Payment */}
                      <td style={{ padding: '14px 10px' }}>
                        <strong style={{ display: 'block' }}>₹{order.total_amount}</strong>
                        <span style={{ fontSize: '0.72rem', color: order.payment_status === 'paid' ? 'var(--accent-sage)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {order.payment_method} · {order.payment_status}
                        </span>
                      </td>

                      {/* Courier Tracking Input */}
                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <input
                            type="text"
                            placeholder="e.g. DELHIVERY-883"
                            value={trackingInputs[order.id] || ''}
                            onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.78rem',
                              border: '1px solid var(--border-color)',
                              borderRadius: '6px',
                              background: 'var(--bg-surface-muted)',
                              width: '130px',
                              color: 'var(--text-primary)'
                            }}
                          />
                          <button
                            onClick={() => handleSaveTracking(order.id)}
                            style={{
                              background: 'var(--accent-gold-light)',
                              border: '1px solid var(--accent-gold-border)',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              color: 'var(--accent-gold)'
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: '14px 10px' }}>
                        <select
                          value={order.order_status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            background: order.order_status === 'Delivered' ? 'var(--accent-forest-light)' : 'var(--bg-surface-muted)',
                            color: order.order_status === 'Delivered' ? 'var(--accent-sage)' : 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 10px' }}>
                        <button
                          onClick={() => onViewOrderInvoice(order)}
                          title="Print invoice"
                          style={{
                            background: 'none',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <FileText size={14} /> Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
