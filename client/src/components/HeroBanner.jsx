import React from 'react';
import { Sparkles, ShieldCheck, Leaf, HeartHandshake, ArrowDown } from 'lucide-react';

export default function HeroBanner({ onExplore }) {
  return (
    <section style={{
      position: 'relative',
      padding: '130px 0 70px',
      background: 'radial-gradient(ellipse at top center, rgba(201, 169, 110, 0.14) 0%, var(--bg-primary) 70%)',
      overflow: 'hidden',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {/* Subtle background ornamentation */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '12rem',
        opacity: 0.03,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        🌿
      </div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        fontSize: '14rem',
        opacity: 0.03,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        🌺
      </div>

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Top Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--accent-gold-light)',
          border: '1px solid var(--accent-gold-border)',
          padding: '6px 18px',
          borderRadius: '30px',
          marginBottom: '20px'
        }}>
          <Sparkles size={14} color="var(--accent-gold)" />
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)',
            fontWeight: 600
          }}>
            Authentic Ayurvedic Apothecary
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 300,
          lineHeight: 1.1,
          marginBottom: '20px',
          color: 'var(--text-primary)',
          letterSpacing: '0.02em'
        }}>
          Sacred Formulations. <br />
          <span className="gold-gradient-text serif-italic" style={{ fontWeight: 400 }}>
            Handcrafted with Ancient Wisdom.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: 1.8,
          fontWeight: 300
        }}>
          Preserving centuries-old Ayurvedic alchemy through the slow ritual of 
          <strong> Kshir Pak Vidhi</strong>. Formulated meticulously in small artisan batches by 
          <strong> Dr. Nidhi Khakhkhar</strong> using raw mountain herbs and zero chemical additives.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px' }}>
          <button
            onClick={() => onExplore('products-section')}
            className="btn-primary"
            style={{ padding: '16px 36px', fontSize: '0.88rem' }}
          >
            Explore Formulations <ArrowDown size={16} />
          </button>
          <button
            onClick={() => onExplore('story-section')}
            className="btn-secondary"
            style={{ padding: '15px 32px' }}
          >
            Our Heritage & Story
          </button>
        </div>

        {/* Trust & Craft Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px',
          maxWidth: '960px',
          margin: '0 auto',
          paddingTop: '20px'
        }}>
          <div className="glass-panel" style={{
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ background: 'var(--accent-gold-light)', padding: '10px', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <Leaf size={20} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 600 }}>100% Herbal</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Raw botanical infusions</p>
            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ background: 'var(--accent-gold-light)', padding: '10px', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 600 }}>Zero Chemicals</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>No SLS, Parabens or Silicones</p>
            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ background: 'var(--accent-gold-light)', padding: '10px', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <HeartHandshake size={20} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 600 }}>BAMS Doctor Crafted</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Authentic Ayurvedic practitioner</p>
            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left'
          }}>
            <div style={{ background: 'var(--accent-gold-light)', padding: '10px', borderRadius: '50%', color: 'var(--accent-gold)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 600 }}>Kshir Pak Vidhi</h4>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Traditional slow-boiled alchemy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
