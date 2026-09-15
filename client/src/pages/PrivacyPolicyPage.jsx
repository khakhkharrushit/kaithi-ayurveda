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

export default function PrivacyPolicyPage({ onBack }) {
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
        <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: 0 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>Last Updated: September 15, 2025</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px', color: 'var(--text-secondary)', lineHeight: 1.85 }}>

        <p>At <strong style={{ color: 'var(--text-primary)' }}>Kaithi Ayurveda</strong> ("we", "our", or "us"), your privacy is of paramount importance. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website and use our services. Please read this policy carefully. If you do not agree with its terms, please discontinue use of our site.</p>

        <SectionTitle>1. Information We Collect</SectionTitle>
        <p>We may collect the following categories of personal information:</p>
        <ul>
          <li><strong style={{ color: 'var(--text-primary)' }}>Identity Data:</strong> Full name, email address, and phone number provided during registration or checkout.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Contact & Delivery Data:</strong> Shipping address, city, state, postal code, and country.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Transaction Data:</strong> Details of products purchased, order amounts, and payment reference numbers (UTR/UPI).</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Technical Data:</strong> IP address, browser type, operating system, and browsing patterns collected via cookies and server logs.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Communication Data:</strong> Messages or inquiries you send us via email or WhatsApp.</li>
        </ul>
        <p>We do <strong>not</strong> collect or store full payment card details. All payment data is handled securely via UPI/banking infrastructure.</p>

        <SectionTitle>2. How We Use Your Information</SectionTitle>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>To process and fulfill your orders, including dispatching and delivery coordination.</li>
          <li>To send order confirmations, shipping updates, and support communications via email.</li>
          <li>To manage your account and provide a personalised shopping experience.</li>
          <li>To comply with legal obligations and prevent fraudulent transactions.</li>
          <li>To improve our website, product offerings, and customer service.</li>
          <li>To send promotional communications, only with your explicit consent and with an option to opt-out.</li>
        </ul>

        <SectionTitle>3. Legal Basis for Processing</SectionTitle>
        <p>We process your personal data only where we have a lawful basis to do so, including:</p>
        <ul>
          <li><strong style={{ color: 'var(--text-primary)' }}>Performance of a contract</strong> — to fulfil your order.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Legitimate interests</strong> — to improve our services and prevent fraud.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Legal compliance</strong> — to meet applicable laws and regulations in India.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Consent</strong> — for marketing communications, which may be withdrawn at any time.</li>
        </ul>

        <SectionTitle>4. Data Sharing and Disclosure</SectionTitle>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your data with:</p>
        <ul>
          <li><strong style={{ color: 'var(--text-primary)' }}>Logistics & Courier Partners:</strong> Name, phone, and address shared for delivery purposes only.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Email Service Providers:</strong> To send transactional emails (e.g., order confirmation, OTP). These providers are contractually obligated to protect your data.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Legal Authorities:</strong> Where required by law, court order, or government regulation.</li>
        </ul>

        <SectionTitle>5. Data Retention</SectionTitle>
        <p>We retain your personal data for as long as your account is active or as required to fulfil the purposes outlined in this policy. Order records are retained for a minimum of 5 years for accounting and legal compliance. You may request deletion of your account data at any time by contacting us.</p>

        <SectionTitle>6. Cookies and Tracking</SectionTitle>
        <p>Our website uses essential session cookies to maintain your login state and cart. We do not use third-party advertising or tracking cookies. You may configure your browser to refuse cookies; however, some site features may not function correctly as a result.</p>

        <SectionTitle>7. Data Security</SectionTitle>
        <p>We implement appropriate technical and organisational security measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. This includes encrypted data transmission (HTTPS), hashed password storage, and OTP-based authentication. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>

        <SectionTitle>8. Your Rights</SectionTitle>
        <p>Subject to applicable law, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request deletion of your personal data ("right to be forgotten").</li>
          <li>Withdraw consent for marketing communications at any time.</li>
          <li>Lodge a complaint with a data protection authority.</li>
        </ul>
        <p>To exercise any of these rights, please contact us at <strong style={{ color: 'var(--gold)' }}>kaithiayurveda@gmail.com</strong>.</p>

        <SectionTitle>9. Children's Privacy</SectionTitle>
        <p>Our website is not directed at children under the age of 13. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such information, please contact us immediately and we will take steps to delete it.</p>

        <SectionTitle>10. Third-Party Links</SectionTitle>
        <p>Our website may contain links to third-party websites (e.g., WhatsApp, payment gateways). We are not responsible for the privacy practices of these sites and encourage you to review their respective privacy policies.</p>

        <SectionTitle>11. Changes to This Policy</SectionTitle>
        <p>We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with a revised "Last Updated" date. Continued use of our website after such changes constitutes your acceptance of the updated policy.</p>

        <SectionTitle>12. Contact Us</SectionTitle>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:</p>
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
