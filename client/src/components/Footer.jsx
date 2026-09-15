import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer({ onNavigate }) {
  const { user, isAdmin } = useAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '70px 0 30px',
      color: 'var(--text-secondary)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid var(--accent-gold)'
              }}>
                <img src="/assets/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', lineHeight: 1 }}>
                  Kaithi
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                  Ayurveda
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.8, marginBottom: '20px', color: 'var(--text-secondary)' }}>
              Sacred handmade cosmetic and wellness elixirs. Formulated in accordance with ancient Charaka Samhita texts by Dr. Nidhi Khakhkhar in Kodinar, Gujarat.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} />
              <span>Certified Ayurvedic Practitioner Formulations</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              marginBottom: '18px'
            }}>
              Sanctuary
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                  All Formulations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                  Kshir Pak Hair Elixirs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                  Cold-Pressed Soaps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                  Herbal Shampoos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                  Order History & Invoices
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Consultation & Contact */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              marginBottom: '18px'
            }}>
              Ayurvedic Consultation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={15} color="var(--accent-gold)" />
                <a href="tel:+919428704882" style={{ color: 'inherit' }}>+91 9428704882</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={15} color="var(--accent-gold)" />
                <a href="mailto:kaithiayurveda@gmail.com" style={{ color: 'inherit' }}>kaithiayurveda@gmail.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={15} color="var(--accent-gold)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>Dr. Nidhi Khakhkhar, Ravi Complex, Avni Apartment, Kodinar, Gujarat - 362720</span>
              </div>
              <a
                href="https://wa.me/919428704882?text=Hello%20Dr.%20Nidhi,%20I%20would%20like%20a%20consultation%20regarding%20Kaithi%20Ayurveda%20products."
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  borderRadius: '24px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  marginTop: '8px',
                  width: 'fit-content'
                }}
              >
                💬 WhatsApp Consultation
              </a>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              marginBottom: '18px'
            }}>
              Join The Circle
            </h4>
            <p style={{ fontSize: '0.84rem', lineHeight: 1.7, marginBottom: '14px' }}>
              Subscribe for seasonal harvest alerts, Ayurvedic wellness rituals, and exclusive introductory benefits.
            </p>
            {subscribed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-sage)', fontSize: '0.84rem' }}>
                <CheckCircle2 size={18} />
                <span>Welcome to the Kaithi family!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent-gold)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    padding: '0 16px',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}>
          <span>© {new Date().getFullYear()} Kaithi Ayurveda. All Rights Reserved. Pure. Handmade. Ancient.</span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span onClick={() => onNavigate('privacy')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--gold)'} onMouseLeave={e => e.target.style.color=''}>Privacy Policy</span>
            <span onClick={() => onNavigate('terms')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--gold)'} onMouseLeave={e => e.target.style.color=''}>Terms of Service</span>
            <span onClick={() => onNavigate('shipping')} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color='var(--gold)'} onMouseLeave={e => e.target.style.color=''}>Shipping & Refunds</span>
            {(!user || isAdmin) && (
              <button
                onClick={() => onNavigate('admin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: 0.6,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
              >
                Staff Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
