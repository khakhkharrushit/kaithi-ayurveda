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

export default function TermsOfServicePage({ onBack }) {
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
        <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: 0 }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>Last Updated: September 15, 2025</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>

        <p>Please read these Terms of Service ("Terms", "Agreement") carefully before using the <strong style={{ color: 'var(--text-primary)' }}>Kaithi Ayurveda</strong> website and services. By accessing or placing an order through our platform, you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be legally bound by them. If you do not agree, please do not use our services.</p>

        <SectionTitle>1. About Us</SectionTitle>
        <p>Kaithi Ayurveda is a handmade Ayurvedic wellness brand operating from Kodinar, Gujarat, India. Our products are formulated by <strong style={{ color: 'var(--text-primary)' }}>Dr. Nidhi Khakhkhar</strong> using traditional ancient recipes. We sell exclusively via our official website at <strong style={{ color: 'var(--gold)' }}>kaithi-ayurveda.onrender.com</strong>.</p>

        <SectionTitle>2. Account Registration</SectionTitle>
        <ul>
          <li>You must provide accurate, current, and complete information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You agree to notify us immediately of any unauthorised access to your account.</li>
          <li>We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.</li>
          <li>One-Time Passwords (OTPs) sent for login are valid for a limited period and must not be shared with anyone, including our staff.</li>
        </ul>

        <SectionTitle>3. Products and Descriptions</SectionTitle>
        <ul>
          <li>All products listed on our website are subject to availability. We reserve the right to limit quantities.</li>
          <li>Product images are for illustrative purposes only and may vary slightly from the actual product due to lighting, screen calibration, or batch variations.</li>
          <li>We make every effort to ensure product descriptions are accurate; however, we do not warrant that all descriptions are error-free, complete, or current.</li>
          <li>Our products are natural/herbal wellness items. They are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before using any herbal product, especially if pregnant, nursing, or on medication.</li>
        </ul>

        <SectionTitle>4. Pricing and Payments</SectionTitle>
        <ul>
          <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
          <li>We reserve the right to change prices at any time without notice. Price changes will not affect orders already placed and confirmed.</li>
          <li>Payments are accepted via UPI (Unified Payments Interface) and Cash on Delivery (COD) where available.</li>
          <li>For UPI payments, you must submit a valid 12-digit UTR (Unique Transaction Reference) number as proof of payment. Orders without a valid UTR will not be processed.</li>
          <li>We are not responsible for payment failures due to issues with your bank, UPI app, or network connectivity.</li>
          <li>COD orders may attract an additional handling fee and are subject to availability in your delivery area.</li>
        </ul>

        <SectionTitle>5. Order Placement and Confirmation</SectionTitle>
        <ul>
          <li>Placing an order constitutes an offer to purchase; it does not constitute a binding contract until we send an order confirmation.</li>
          <li>We reserve the right to cancel or refuse any order at our discretion, including cases of suspected fraud, incorrect pricing, or stock unavailability.</li>
          <li>Order confirmation will be sent to your registered email address. Please ensure your email is correct at the time of purchase.</li>
          <li>You are responsible for providing accurate shipping information. We are not liable for non-delivery due to incorrect addresses.</li>
        </ul>

        <SectionTitle>6. Intellectual Property</SectionTitle>
        <p>All content on this website — including text, images, product formulations, branding, logos, and design — is the exclusive property of Kaithi Ayurveda and is protected under applicable intellectual property laws. You may not reproduce, distribute, modify, or commercially exploit any content without our prior written consent.</p>

        <SectionTitle>7. Prohibited Conduct</SectionTitle>
        <p>You agree not to:</p>
        <ul>
          <li>Use our website for any unlawful, fraudulent, or malicious purpose.</li>
          <li>Submit false, misleading, or fabricated UTR/payment information.</li>
          <li>Attempt to gain unauthorised access to any part of the website or its backend systems.</li>
          <li>Upload or transmit viruses or any code of a destructive nature.</li>
          <li>Use automated tools (bots, scrapers) to access, collect, or submit data on our platform.</li>
          <li>Impersonate Kaithi Ayurveda staff or other users.</li>
        </ul>

        <SectionTitle>8. Limitation of Liability</SectionTitle>
        <p>To the maximum extent permitted by applicable law, Kaithi Ayurveda shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of or inability to use our website or products. Our total liability in connection with any claim shall not exceed the amount paid by you for the specific product giving rise to the claim.</p>

        <SectionTitle>9. Disclaimer of Warranties</SectionTitle>
        <p>Our website and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the website will be uninterrupted, error-free, or free of viruses.</p>

        <SectionTitle>10. Governing Law and Dispute Resolution</SectionTitle>
        <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts located in <strong style={{ color: 'var(--text-primary)' }}>Gir Somnath District, Gujarat, India</strong>. We encourage resolution of disputes through good-faith negotiation before resorting to legal proceedings.</p>

        <SectionTitle>11. Changes to Terms</SectionTitle>
        <p>We reserve the right to modify these Terms at any time. Changes will be posted on this page with a revised "Last Updated" date. Your continued use of the website after any changes constitutes your acceptance of the new Terms.</p>

        <SectionTitle>12. Contact Us</SectionTitle>
        <p>For any questions regarding these Terms of Service, please contact us:</p>
        <ul>
          <li><strong style={{ color: 'var(--text-primary)' }}>Business Name:</strong> Kaithi Ayurveda</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Address:</strong> Ravi Complex, Avni Apartment, Kodinar, Gujarat – 362720, India</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> kaithiayurveda@gmail.com</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Phone:</strong> +91 9428704882</li>
        </ul>

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
