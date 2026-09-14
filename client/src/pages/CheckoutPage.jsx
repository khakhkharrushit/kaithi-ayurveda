import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2, CreditCard, Zap, Truck, Tag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage({ onBack, onOrderSuccess }) {
  const {
    items,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    coupon,
    clearCart
  } = useCart();
  const { user, openAuthModal } = useAuth();

  // Shipping Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Kodinar');
  const [state, setState] = useState(user?.state || 'Gujarat');
  const [pincode, setPincode] = useState(user?.pincode || '362720');
  const [notes, setNotes] = useState('');

  // Payment Method: 'upi_direct' | 'test' | 'razorpay' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('upi_direct');
  const [upiUtr, setUpiUtr] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const merchantVpa = 'rushitkhakhkharadvocate@okhdfcbank';
  const merchantNumber = '9228207999';
  const upiPayUrl = `upi://pay?pa=${merchantVpa}&pn=Kaithi%20Ayurveda&am=${totalAmount}&cu=INR&tn=Kaithi%20Ayurveda%20Order`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPayUrl)}`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 3000);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(merchantNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
      if (!address) setAddress(user.address || '');
      if (!city) setCity(user.city || 'Kodinar');
      if (!state) setState(user.state || 'Gujarat');
      if (!pincode) setPincode(user.pincode || '362720');
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '160px 0 100px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '12px' }}>
          Your bag is empty
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          Add some herbal elixirs before proceeding to checkout.
        </p>
        <button onClick={onBack} className="btn-primary">
          Return to Formulations
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '160px 0 100px', display: 'flex', justifyContent: 'center' }}>
        <div className="luxury-card" style={{ padding: '40px 32px', textAlign: 'center', maxWidth: '520px', width: '100%' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--accent-gold)'
          }}>
            <Lock size={30} />
          </div>
          <span className="luxury-subtitle">Authentication Required</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '8px 0 12px' }}>
            Sign In to Complete Purchase
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '28px', lineHeight: 1.6 }}>
            Please sign in to your Kaithi account or register to access saved delivery addresses, apply member coupons, and securely place your order.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => openAuthModal('login', 'Sign in to complete your checkout.')}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.86rem' }}
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => openAuthModal('register', 'Create an account to complete your checkout.')}
              className="btn-secondary"
              style={{ width: '100%', padding: '14px', fontSize: '0.86rem' }}
            >
              Create New Account
            </button>
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              ← Return to Bag
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !phone || !address) {
      setErrorMsg('Please provide your complete name, email, phone, and delivery address.');
      return;
    }

    if (paymentMethod === 'upi_direct' && !upiUtr.trim()) {
      setErrorMsg('Please enter the 12-digit UPI UTR / Transaction Reference Number after completing payment.');
      return;
    }

    setProcessing(true);

    try {
      // 1. Direct Zero-Fee UPI Payment
      if (paymentMethod === 'upi_direct') {
        await verifyAndCreateOrder({
          payment_method: 'UPI Direct (0% Fee)',
          payment_status: 'paid',
          razorpay_payment_id: `UTR: ${upiUtr.trim()}`
        });
        return;
      }

      // 2. If Razorpay selected and window.Razorpay exists
      if (paymentMethod === 'razorpay') {
        const orderRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            receipt: `rcpt_${Date.now()}`,
            notes: { customer_name: name, customer_email: email }
          })
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error || 'Failed to initialize Razorpay');

        // Check if real Razorpay library is available in window
        if (window.Razorpay && orderData.mode !== 'test_simulation') {
          const options = {
            key: "rzp_test_kaithi_demo",
            amount: orderData.amount,
            currency: "INR",
            name: "Kaithi Ayurveda",
            description: "Handcrafted Ayurvedic Formulations",
            image: "/assets/logo.jpg",
            order_id: orderData.id,
            handler: async function (response) {
              await verifyAndCreateOrder({
                payment_method: 'razorpay',
                payment_status: 'paid',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id
              });
            },
            prefill: {
              name: name,
              email: email,
              contact: phone
            },
            theme: { color: "#C9A96E" }
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.on('payment.failed', function (response) {
            setErrorMsg(`Payment failed: ${response.error.description}`);
            setProcessing(false);
          });
          rzp1.open();
          return;
        }
      }

      // 3. Instant Test Payment or COD or fallback test mode
      const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'paid';
      const mockPayId = paymentMethod === 'test' ? `pay_test_${Math.random().toString(36).substring(2, 9)}` : null;

      await verifyAndCreateOrder({
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        razorpay_payment_id: mockPayId
      });

    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
      setProcessing(false);
    }
  };

  const verifyAndCreateOrder = async ({ payment_method, payment_status, razorpay_order_id, razorpay_payment_id }) => {
    const payload = {
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      shipping_address: address,
      city,
      state,
      pincode,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        weight: i.weight
      })),
      subtotal,
      discount_amount: discountAmount,
      coupon_code: coupon ? coupon.code : null,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      payment_method,
      payment_status,
      razorpay_order_id,
      razorpay_payment_id,
      notes
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(user ? { Authorization: `Bearer ${localStorage.getItem('kaithi_token')}` } : {})
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order creation failed');

    clearCart();
    setProcessing(false);
    onOrderSuccess(data.order);
  };

  return (
    <div style={{ padding: '120px 0 80px' }}>
      <div className="container">
        {/* Back button */}
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
            marginBottom: '26px',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> Return to Bag
        </button>

        <div style={{ marginBottom: '30px' }}>
          <span className="luxury-subtitle">Secure Checkout</span>
          <h1 className="luxury-title" style={{ marginTop: '4px' }}>
            Complete Your Ritual
          </h1>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(155, 44, 59, 0.1)',
            border: '1px solid rgba(155, 44, 59, 0.3)',
            color: 'var(--accent-crimson)',
            padding: '14px 18px',
            borderRadius: '10px',
            fontSize: '0.88rem',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Column Layout */}
        <form onSubmit={handlePlaceOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Left Column: Shipping & Payment */}
            <div>
              {/* Delivery Address Card */}
              <div className="luxury-card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} color="var(--accent-gold)" /> Shipping Destination
                </h3>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Email for Tracking *</label>
                    <input
                      type="email"
                      required
                      placeholder="radhika@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Flat / Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Bungalow 12, Rosewood Lane"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Special Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave with security / call before delivery"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="luxury-card" style={{ padding: '28px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="var(--accent-gold)" /> Payment Gateway
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Option 1: Direct Zero-Fee Dynamic UPI QR */}
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '18px',
                      borderRadius: '14px',
                      border: paymentMethod === 'upi_direct' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      background: paymentMethod === 'upi_direct' ? 'var(--accent-gold-light)' : 'var(--bg-surface-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi_direct"
                        checked={paymentMethod === 'upi_direct'}
                        onChange={() => setPaymentMethod('upi_direct')}
                        style={{ accentColor: 'var(--accent-gold)', width: '18px', height: '18px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.94rem' }}>🌿 Direct UPI / GPay / PhonePe / QR</strong>
                          <span style={{
                            background: 'var(--accent-sage)',
                            color: '#FFFFFF',
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontWeight: 600
                          }}>
                            0% Extra Fees
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Instant payment via Google Pay, PhonePe, Paytm, BHIM or any UPI App with Zero transaction fee.
                        </p>
                      </div>
                    </div>

                    {/* Expanded UPI QR & UTR input box when selected */}
                    {paymentMethod === 'upi_direct' && (
                      <div style={{
                        marginTop: '18px',
                        paddingTop: '16px',
                        borderTop: '1px dashed var(--accent-gold-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Scan to Pay Exactly ₹{totalAmount}
                        </span>

                        {/* Dynamic QR Code */}
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: '#FFFFFF',
                          borderRadius: '12px',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                          display: 'inline-block'
                        }}>
                          <img
                            src={qrCodeUrl}
                            alt="Scan UPI QR"
                            style={{ width: '170px', height: '170px', display: 'block' }}
                          />
                        </div>

                        {/* UPI VPA & Number Copy Helpers */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', width: '100%', maxWidth: '340px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--bg-surface)',
                            padding: '8px 14px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.78rem'
                          }}>
                            <span>UPI ID: <strong style={{ wordBreak: 'break-all' }}>{merchantVpa}</strong></span>
                            <button
                              type="button"
                              onClick={handleCopyVpa}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-gold)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.76rem',
                                marginLeft: '8px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {copiedVpa ? '✓ Copied!' : 'Copy'}
                            </button>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--bg-surface)',
                            padding: '8px 14px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.78rem'
                          }}>
                            <span>UPI Number (GPay/PhonePe): <strong>{merchantNumber}</strong></span>
                            <button
                              type="button"
                              onClick={handleCopyNumber}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-gold)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.76rem',
                                marginLeft: '8px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {copiedNumber ? '✓ Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>

                        {/* Mobile Direct Pay Link */}
                        <div style={{ marginTop: '12px' }}>
                          <a
                            href={upiPayUrl}
                            style={{
                              display: 'inline-block',
                              padding: '8px 18px',
                              background: 'var(--accent-gold)',
                              color: '#FFFFFF',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            📱 Tap to Pay on Mobile UPI App
                          </a>
                        </div>

                        {/* 12-Digit UTR Input */}
                        <div style={{ width: '100%', maxWidth: '340px', marginTop: '18px', textAlign: 'left' }}>
                          <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                            Enter 12-digit UPI Reference / UTR No. *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 425910382910"
                            maxLength={16}
                            value={upiUtr}
                            onChange={(e) => setUpiUtr(e.target.value)}
                            className="form-input"
                            style={{ textAlign: 'center', letterSpacing: '0.1em', fontWeight: 600 }}
                          />
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                            Found in your GPay / PhonePe / Paytm transaction details receipt.
                          </span>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* Option 2: Instant Test Payment */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: paymentMethod === 'test' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      background: paymentMethod === 'test' ? 'var(--accent-gold-light)' : 'var(--bg-surface-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="test"
                      checked={paymentMethod === 'test'}
                      onChange={() => setPaymentMethod('test')}
                      style={{ accentColor: 'var(--accent-gold)', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={16} color="var(--accent-gold)" />
                        <strong style={{ fontSize: '0.92rem' }}>⚡ 1-Click Instant Test Simulation</strong>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Simulates a successful payment instantly without opening external banking apps.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Razorpay */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: paymentMethod === 'razorpay' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      background: paymentMethod === 'razorpay' ? 'var(--accent-gold-light)' : 'var(--bg-surface-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      style={{ accentColor: 'var(--accent-gold)', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={16} color="var(--accent-gold)" />
                        <strong style={{ fontSize: '0.92rem' }}>Razorpay Gateway (Cards & NetBanking)</strong>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Standard payment gateway for Credit/Debit cards & NetBanking.
                      </p>
                    </div>
                  </label>

                  {/* Option 4: COD */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: '12px',
                      border: paymentMethod === 'cod' ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                      background: paymentMethod === 'cod' ? 'var(--accent-gold-light)' : 'var(--bg-surface-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ accentColor: 'var(--accent-gold)', width: '18px', height: '18px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.92rem' }}>Cash on Delivery (COD)</strong>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Pay cash upon delivery by our verified courier partner.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div>
              <div className="luxury-card" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '18px' }}>
                  Order Summary
                </h3>

                {/* Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: 'var(--bg-surface-muted)',
                        flexShrink: 0
                      }}>
                        <img
                          src={item.image ? `/assets/${item.image}` : '/assets/logo.jpg'}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 500, display: 'block', lineHeight: 1.2 }}>
                          {item.name}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} · {item.weight || ''}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600 }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
                      <span>Discount ({coupon?.code})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Courier Delivery</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 600 }}>
                    <span>Total Amount</span>
                    <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontSize: '1.6rem' }}>
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {/* Final Order Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px 0', fontSize: '0.92rem', opacity: processing ? 0.7 : 1 }}
                >
                  <Lock size={16} />
                  {processing ? 'Securing Transaction...' : `Pay ₹${totalAmount} & Place Order`}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  <ShieldCheck size={14} color="var(--accent-gold)" />
                  <span>256-Bit Encrypted Payment · Pure Ayurvedic Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
