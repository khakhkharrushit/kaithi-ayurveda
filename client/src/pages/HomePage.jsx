import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { Filter, Star, Play, ShieldCheck, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

export default function HomePage({ onSelectProduct, searchQuery, onCheckout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?category=${encodeURIComponent(activeCategory)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (sortBy !== 'featured') url += `&sort=${encodeURIComponent(sortBy)}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Hair Care', 'Face Care', 'Body Care'];

  const igPosts = [
    { img: 'ig_post_1.jpg', title: 'Slow Curing Soaps' },
    { img: 'ig_post_2.jpg', title: 'Fresh Herb Extractions' },
    { img: 'ig_post_3.jpg', title: 'Neelibringraj Infusion' },
    { img: 'ig_post_4.jpg', title: 'Artisan Batch Bottling' },
    { img: 'ig_post_5.jpg', title: 'Organic Aloe Harvest' },
    { img: 'ig_post_6.jpg', title: 'Sun-dried Face Packs' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroBanner onExplore={(targetId) => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Main Formulations Section */}
      <section id="products-section" style={{ padding: '80px 0 60px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="luxury-subtitle">The Pharmacopoeia</span>
            <h2 className="luxury-title" style={{ marginTop: '6px' }}>
              Sacred Formulations
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '12px auto 0', fontSize: '0.95rem' }}>
              Handcrafted in small artisan batches adhering to the traditional Charaka Samhita pharmacopoeia.
            </p>
          </div>

          {/* Category Filter Pills & Sorting */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '36px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--border-color)'
          }}>
            {/* Category Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '30px',
                    fontSize: '0.82rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)',
                    background: activeCategory === cat ? 'var(--accent-gold)' : 'var(--bg-surface-muted)',
                    color: activeCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                    border: `1px solid ${activeCategory === cat ? 'var(--accent-gold)' : 'var(--border-color)'}`,
                    fontWeight: activeCategory === cat ? 600 : 400
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Curated (Featured)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>Fetching authentic formulations...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '10px' }}>No Formulations Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Founder Story Section */}
      <section id="story-section" style={{
        padding: '90px 0',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}>
            {/* Founder Image */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '2px solid var(--accent-gold-border)',
                background: 'var(--bg-surface-muted)'
              }}>
                <img
                  src="/assets/founder.jpg"
                  alt="Dr. Nidhi Khakhkhar"
                  style={{
                    width: '100%',
                    height: '520px',
                    objectFit: 'cover',
                    objectPosition: 'center 12%'
                  }}
                  onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--accent-gold)',
                borderRadius: '16px',
                padding: '16px 22px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--accent-gold)', fontWeight: 600, display: 'block' }}>
                  Dr. Nidhi Khakhkhar
                </span>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  B.A.M.S. · Ayurvedic Physician
                </span>
              </div>
            </div>

            {/* Founder Content */}
            <div>
              <span className="luxury-subtitle">The Hand That Crafts</span>
              <h2 className="luxury-title" style={{ marginTop: '8px', marginBottom: '22px' }}>
                Reviving Ancient Botanical Purity
              </h2>
              <p style={{ fontSize: '0.98rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '18px' }}>
                "Modern cosmetics promise instant beauty through synthetic silicones and harsh surfactants that deplete the skin’s natural microbiome. Kaithi Ayurveda was born to reconnect modern self-care with India’s ancient healing lineage."
              </p>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '24px' }}>
                As a trained Ayurvedic practitioner (BAMS), Dr. Nidhi personally oversees each artisan batch prepared in Kodinar, Gujarat. Using raw botanicals harvested in peak season—from mountain-grown Neelibringraj to Kashmiri saffron—each formulation is cured slowly without artificial foaming agents, parabens, or synthetic fragrance oils.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <div style={{ borderLeft: '2px solid var(--accent-gold)', paddingLeft: '14px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent-gold)', fontWeight: 400 }}>100%</h4>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Handmade in Small Batches</span>
                </div>
                <div style={{ borderLeft: '2px solid var(--accent-gold)', paddingLeft: '14px' }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent-gold)', fontWeight: 400 }}>0%</h4>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>SLS & Parabens</span>
                </div>
              </div>

              <a
                href="https://wa.me/919428704882?text=Hello%20Dr.%20Nidhi,%20I%20have%20questions%20about%20your%20Ayurvedic%20remedies."
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Personal Consultation with Dr. Nidhi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Kshir Pak Vidhi & Process Videos */}
      <section id="process-section" style={{ padding: '90px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="luxury-subtitle">Sacred Alchemy</span>
            <h2 className="luxury-title" style={{ marginTop: '6px' }}>
              Witness The Traditional Craft
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '12px auto 0', fontSize: '0.95rem' }}>
              Watch how ancient slow-boiling (Kshir Pak Vidhi) infuses active botanical nutrients into pure milk and cold-pressed sesame oil.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {/* Video 1 */}
            <div className="luxury-card" style={{ padding: '16px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '260px', background: '#000' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/wcpJaFkW5v8"
                  title="Herbal Hair Oil Kshir Pak Vidhi"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{ padding: '16px 8px 6px' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  Sacred Process
                </span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '4px', marginBottom: '6px' }}>
                  Kshir Pak Vidhi Hair Oil Preparation
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Herbs are slow-boiled in pure dairy milk over hours until all water content evaporates, leaving 100% concentrated medicinal lipids.
                </p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="luxury-card" style={{ padding: '16px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '260px', background: '#000' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/sq9ePNMWaQE"
                  title="Hibiscus Shampoo Crafting"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div style={{ padding: '16px 8px 6px' }}>
                <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  Botanical Extraction
                </span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginTop: '4px', marginBottom: '6px' }}>
                  Hand-Pressed Hibiscus & Amla Cleanser
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Fresh organic hibiscus blossoms and Reetha berries simmered to unlock natural foaming saponins without synthetic surfactants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Aesthetic Gallery */}
      <section style={{
        padding: '70px 0',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="luxury-subtitle">Visual Sanctuary</span>
              <h2 className="luxury-title" style={{ marginTop: '4px' }}>@kaithiayurveda</h2>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--accent-gold)',
                fontSize: '0.84rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>Follow on Instagram</span>
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px'
          }}>
            {igPosts.map((post, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  paddingTop: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={`/assets/${post.img}`}
                  alt={post.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onError={(e) => { e.target.src = '/assets/logo.jpg'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Kaithi Purity Code */}
      <section style={{ padding: '90px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="luxury-subtitle">Our Solemn Commitment</span>
            <h2 className="luxury-title" style={{ marginTop: '6px' }}>
              The Kaithi Purity Standard
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '12px auto 0', fontSize: '0.95rem' }}>
              Every bottle and bar is handmade in small batches in Kodinar, Gujarat under strict classical Ayurvedic principles.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '26px'
          }}>
            <div className="luxury-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--accent-gold-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                marginBottom: '18px',
                fontSize: '1.4rem'
              }}>
                🌿
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '10px' }}>
                100% Raw Botanicals
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Pure herbs sourced directly from native harvesters. Free from artificial foaming agents, parabens, sulphates, and synthetic colours.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--accent-gold-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                marginBottom: '18px',
                fontSize: '1.4rem'
              }}>
                🔥
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '10px' }}>
                Authentic Kshir Pak Vidhi
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Cooked slowly in pure milk and cold-pressed oils over gentle wood fire for over 18 hours to preserve bio-active herb potency.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--accent-gold-light)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold)',
                marginBottom: '18px',
                fontSize: '1.4rem'
              }}>
                🩺
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '10px' }}>
                Doctor Formulated
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Directly designed, prepared, and quality-tested by Ayurvedic Physician Dr. Nidhi Khakhkhar in Kodinar, Gujarat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact Anchor */}
      <div id="contact-section"></div>
    </div>
  );
}
