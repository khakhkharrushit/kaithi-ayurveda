import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, ArrowRight, Package, Truck, Clock, MapPin, ShieldCheck, Star } from 'lucide-react';

export default function OrderSuccessPage({ order, onContinueShopping, onLeaveFeedback }) {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Trigger luxury golden confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A96E', '#1A3D20', '#EAD4AA', '#3D6B4F']
      });
    } catch (e) {
      console.warn('Confetti effect ignored', e);
    }
  }, []);

  if (!order) {
    return (
      <div className="container" style={{ padding: '160px 0 100px', textAlign: 'center' }}>
        <h2>No active order found</h2>
        <button onClick={onContinueShopping} className="btn-primary" style={{ marginTop: '20px' }}>
          Explore Formulations
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & Verified', completed: true, current: false },
    { title: 'Artisan Bottling', desc: 'Handcrafted in Sanctuary', completed: false, current: true },
    { title: 'Shipped', desc: 'Delhivery / BlueDart Express', completed: false, current: false },
    { title: 'Delivered', desc: 'To Your Doorstep', completed: false, current: false }
  ];

  return (
    <div style={{ padding: '120px 0 80px' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'var(--accent-forest-light)',
            border: '2px solid var(--accent-sage)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-sage)',
            marginBottom: '18px'
          }}>
            <CheckCircle2 size={42} />
          </div>

          <span className="luxury-subtitle">Sacred Confirmation</span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 400,
            marginTop: '6px',
            marginBottom: '10px'
          }}>
            Your Order is Confirmed
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Thank you, <strong>{order.customer_name}</strong>. A confirmation email has been dispatched to <strong>{order.customer_email}</strong>.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-surface-muted)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '8px 20px',
            marginTop: '16px'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Order Reference:
            </span>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--accent-gold)' }}>
              {order.order_number}
            </strong>
          </div>
        </div>

        {/* Order Status Timeline Tracker */}
        <div className="luxury-card" style={{ padding: '30px', marginBottom: '36px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '24px' }}>
            Dispatch & Fulfillment Status
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '20px',
            position: 'relative'
          }}>
            {steps.map((step, index) => (
              <div key={index} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: step.completed ? 'var(--accent-sage)' : (step.current ? 'var(--accent-gold)' : 'var(--bg-surface-muted)'),
                  color: (step.completed || step.current) ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  boxShadow: step.current ? 'var(--shadow-gold)' : 'none'
                }}>
                  {step.completed ? '✓' : index + 1}
                </div>
                <h4 style={{ fontSize: '0.86rem', fontWeight: 600, color: step.current ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Itemized Printable Invoice Card */}
        <div id="printable-invoice" className="luxury-card" style={{ padding: '36px', marginBottom: '36px' }}>
          {/* Invoice Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '24px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent-gold)' }}>
                <img src="/assets/logo.jpg" alt="Kaithi Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                  Kaithi Ayurveda
                </h2>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                  Dr. Nidhi Khakhkhar (BAMS)
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge-gold">Tax Invoice</span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Date: {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Payment: <strong style={{ textTransform: 'uppercase' }}>{order.payment_method}</strong> ({order.payment_status})
              </p>
            </div>
          </div>

          {/* Customer Address Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '28px',
            fontSize: '0.85rem'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Billed & Shipped To:
              </span>
              <strong style={{ fontSize: '0.98rem', display: 'block' }}>{order.customer_name}</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                {order.shipping_address}<br />
                {order.city}, {order.state} - {order.pincode}<br />
                Phone: {order.customer_phone}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Formulation Laboratory:
              </span>
              <strong style={{ fontSize: '0.98rem', display: 'block' }}>Kaithi Ayurveda Herbal Sanctuary</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                Ravi Complex, Avni Apartment, Kodinar, Gujarat - 362720<br />
                WhatsApp: +91 9428704882<br />
                Email: kaithiayurveda@gmail.com
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '24px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.74rem', textTransform: 'uppercase' }}>Item</th>
                <th style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '10px 0', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.74rem', textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((it, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 0' }}>
                    <strong style={{ display: 'block' }}>{it.product_name}</strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{it.weight || ''}</span>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'center' }}>{it.quantity}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right' }}>₹{it.price}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>₹{it.price * it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Breakdown */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount_amount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
                  <span>Discount ({order.coupon_code || 'Promo'})</span>
                  <span>-₹{order.discount_amount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Courier Delivery</span>
                <span>{order.shipping_fee === 0 ? 'FREE' : `₹${order.shipping_fee}`}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600 }}>
                <span>Paid Amount</span>
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '1.4rem' }}>
                  ₹{order.total_amount}
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Pure Ancient Formulations · Handmade by Dr. Nidhi Khakhkhar · For customer support WhatsApp +91 9428704882
          </div>
        </div>

        {/* Action Controls: Print, Review & Continue */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ padding: '14px 24px' }}
          >
            <Printer size={16} /> Print Official Invoice
          </button>
          {onLeaveFeedback && (
            <button
              onClick={() => onLeaveFeedback(order.order_number)}
              className="btn-secondary"
              style={{
                padding: '14px 24px',
                borderColor: 'var(--accent-gold-border, rgba(201,169,110,0.4))',
                color: 'var(--accent-gold, #C9A96E)'
              }}
            >
              <Star size={16} /> Share Feedback
            </button>
          )}
          <button
            onClick={onContinueShopping}
            className="btn-primary"
            style={{ padding: '14px 28px' }}
          >
            Explore More Formulations <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
