import React from 'react';

const SectionTitle = ({ children }) => (
  <h2 style={{
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'var(--gold)',
    margin: '2rem 0 0.6rem',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(201,169,110,0.2)',
    paddingBottom: '6px'
  }}>{children}</h2>
);

const InfoCard = ({ emoji, title, value }) => (
  <div style={{
    background: 'rgba(201,169,110,0.06)',
    border: '1px solid rgba(201,169,110,0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px'
  }}>
    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{emoji}</span>
    <div>
      <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.5px', marginBottom: '3px' }}>{title}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{value}</div>
    </div>
  </div>
);

export default function ShippingRefundsPage({ onBack }) {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--forest-deep) 0%, var(--forest-mid) 100%)',
        padding: '60px 24px 40px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(201,169,110,0.25)'
      }}>
        <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 10px' }}>Legal</p>
        <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: 0 }}>Shipping & Refund Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>Last Updated: September 15, 2025</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>

        <p>At <strong style={{ color: 'var(--text-primary)' }}>Kaithi Ayurveda</strong>, we are committed to delivering our handcrafted Ayurvedic products to you safely and on time. Please review our Shipping & Refund Policy carefully before placing your order.</p>

        {/* Quick Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', margin: '28px 0' }}>
          <InfoCard emoji="📦" title="Dispatch Time" value="1–3 business days after order confirmation" />
          <InfoCard emoji="🚚" title="Delivery Time" value="5–10 business days across India" />
          <InfoCard emoji="🆓" title="Free Shipping" value="On all orders above ₹499" />
          <InfoCard emoji="↩️" title="Return Window" value="7 days from date of delivery" />
        </div>

        {/* Shipping */}
        <SectionTitle>1. Order Processing</SectionTitle>
        <ul>
          <li>Orders are processed within <strong style={{ color: 'var(--text-primary)' }}>1–3 business days</strong> after payment confirmation (Monday to Saturday, excluding public holidays).</li>
          <li>For UPI payments, processing begins only after your UTR number is verified by our team.</li>
          <li>For Cash on Delivery (COD) orders, processing begins immediately upon order placement.</li>
          <li>You will receive an email confirmation once your order has been dispatched, including a tracking number where applicable.</li>
          <li>During peak sale periods, festivals, or adverse weather conditions, processing times may be slightly extended. We appreciate your patience.</li>
        </ul>

        <SectionTitle>2. Shipping Coverage</SectionTitle>
        <ul>
          <li>We currently ship to all major cities and towns across <strong style={{ color: 'var(--text-primary)' }}>India</strong>.</li>
          <li>We do not currently offer international shipping. This may be extended in the future.</li>
          <li>Delivery to remote or Tier-3 locations may take additional time beyond our standard estimate.</li>
          <li>P.O. Boxes may not be serviceable by all our courier partners. Please provide a complete and precise delivery address.</li>
        </ul>

        <SectionTitle>3. Shipping Charges</SectionTitle>
        <ul>
          <li><strong style={{ color: 'var(--text-primary)' }}>Free shipping</strong> is available on all prepaid orders above ₹499.</li>
          <li>Orders below ₹499 may attract a nominal shipping fee of ₹49–₹79, displayed at checkout.</li>
          <li>COD orders may incur an additional handling charge of ₹30–₹60, which will be displayed before order confirmation.</li>
        </ul>

        <SectionTitle>4. Delivery Timeframes</SectionTitle>
        <ul>
          <li><strong style={{ color: 'var(--text-primary)' }}>Metro cities</strong> (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata): 3–5 business days</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Tier-1 & Tier-2 cities:</strong> 5–7 business days</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Tier-3 cities & rural areas:</strong> 7–10 business days</li>
          <li>These are estimates only. Kaithi Ayurveda is not responsible for delays caused by courier partners, natural disasters, or government-mandated lockdowns.</li>
        </ul>

        <SectionTitle>5. Tracking Your Order</SectionTitle>
        <p>Once dispatched, a tracking ID will be sent to your registered email and/or WhatsApp. You can use this to track your shipment on the courier partner's website. If you have not received tracking information within 3 business days of your order confirmation, please contact us.</p>

        <SectionTitle>6. Damaged or Incorrect Orders</SectionTitle>
        <p>We take utmost care in packaging every order. In the unlikely event that your order arrives damaged, tampered, or contains incorrect items:</p>
        <ul>
          <li>Please do <strong style={{ color: 'var(--text-primary)' }}>not accept</strong> the delivery if the outer packaging appears visibly damaged or tampered.</li>
          <li>Contact us within <strong style={{ color: 'var(--text-primary)' }}>48 hours</strong> of delivery with clear photographs of the damaged/incorrect product and packaging.</li>
          <li>Upon verification, we will arrange a <strong style={{ color: 'var(--text-primary)' }}>free replacement or full refund</strong> at your preference.</li>
        </ul>

        {/* Refunds */}
        <SectionTitle>7. Returns & Exchanges</SectionTitle>
        <ul>
          <li>We accept returns within <strong style={{ color: 'var(--text-primary)' }}>7 days</strong> of delivery for items that are unused, unopened, and in their original packaging.</li>
          <li>For hygiene and safety reasons, opened or partially used products are <strong style={{ color: 'var(--text-primary)' }}>not eligible</strong> for return or exchange, unless the product is defective or has caused an adverse reaction.</li>
          <li>Products purchased during sale or with promotional discount codes are not eligible for return unless defective.</li>
          <li>To initiate a return, contact us at <strong style={{ color: 'var(--gold)' }}>kaithiayurveda@gmail.com</strong> with your order number and reason for return.</li>
          <li>Return shipping costs are borne by the customer unless the return is due to our error (wrong or defective product).</li>
        </ul>

        <SectionTitle>8. Refund Process</SectionTitle>
        <ul>
          <li>Refunds are processed after we receive and inspect the returned product.</li>
          <li>Approved refunds are issued within <strong style={{ color: 'var(--text-primary)' }}>5–7 business days</strong> of receiving the return.</li>
          <li>Refunds are processed to the original payment source (UPI/bank account from which the payment was made).</li>
          <li>For COD orders, refunds will be issued via bank transfer/UPI to the details provided by you.</li>
          <li>Shipping charges (if any) are non-refundable unless the return is due to our error.</li>
        </ul>

        <SectionTitle>9. Cancellations</SectionTitle>
        <ul>
          <li>Orders can be cancelled within <strong style={{ color: 'var(--text-primary)' }}>12 hours</strong> of placement, before dispatch.</li>
          <li>Once an order has been dispatched, it cannot be cancelled. You may initiate a return after delivery.</li>
          <li>To cancel an order, please contact us immediately via email at <strong style={{ color: 'var(--gold)' }}>kaithiayurveda@gmail.com</strong> or WhatsApp at +91 9428704882 with your order number.</li>
          <li>Refunds for cancelled prepaid orders will be processed within 5–7 business days.</li>
        </ul>

        <SectionTitle>10. Non-Returnable Items</SectionTitle>
        <p>The following items are strictly non-returnable:</p>
        <ul>
          <li>Products that have been opened, used, or altered.</li>
          <li>Products without their original packaging or labelling.</li>
          <li>Gift sets or combo packs where individual products have been separated.</li>
          <li>Items purchased during final sale or clearance events.</li>
        </ul>

        <SectionTitle>11. Contact for Shipping & Refund Queries</SectionTitle>
        <p>Our customer support team is available Monday to Saturday, 9:00 AM – 6:00 PM IST.</p>
        <ul>
          <li><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> kaithiayurveda@gmail.com</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>WhatsApp:</strong> +91 9428704882</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Address:</strong> Ravi Complex, Avni Apartment, Kodinar, Gujarat – 362720, India</li>
        </ul>
        <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          We strive to resolve all queries within 1–2 business days. Thank you for choosing Kaithi Ayurveda — your trust in our pure, handmade products is what drives us every day.
        </p>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(201,169,110,0.15)', textAlign: 'center' }}>
          <button
            onClick={onBack}
            style={{
              background: 'linear-gradient(135deg, var(--gold) 0%, #b8912a 100%)',
              color: '#0D1F12',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 36px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
