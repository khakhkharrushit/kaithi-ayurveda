import React, { useState } from 'react';
import { ShoppingBag, User, Sun, Moon, Search, X, Shield, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onNavigate, currentPage, searchQuery, setSearchQuery }) {
  const { user, openAuthModal, logout, isAdmin } = useAuth();
  const { totalItemsCount, openCart, resetClientCartOnLogout } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (page, anchor = null) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <header className="glass-panel" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '10px 0',
        transition: 'var(--transition-smooth)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Mobile Hamburger Menu Toggle + Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="mobile-nav-toggle"
              aria-label="Toggle Navigation Menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Brand Logo & Name */}
            <div 
              onClick={() => handleNav('home')} 
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--accent-gold)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                background: '#1A3D20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img 
                  src="/assets/logo.jpg" 
                  alt="Kaithi Ayurveda" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '🌿';
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  color: 'var(--text-primary)'
                }}>
                  Kaithi
                </span>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  fontWeight: 500,
                  marginTop: '2px'
                }}>
                  Ayurveda
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
            <button 
              onClick={() => handleNav('home', 'products-section')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: currentPage === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 500,
                transition: 'var(--transition-smooth)'
              }}
            >
              Formulations
            </button>
            <button 
              onClick={() => handleNav('home', 'story-section')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              Founder's Story
            </button>
            <button 
              onClick={() => handleNav('home', 'process-section')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              Kshir Pak Vidhi
            </button>
            <button 
              onClick={() => handleNav('home', 'contact-section')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              Contact
            </button>

            {isAdmin && (
              <button 
                onClick={() => handleNav('admin')}
                style={{
                  background: 'var(--accent-gold-light)',
                  border: '1px solid var(--accent-gold-border)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Shield size={13} /> Admin Portal
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search Toggle / Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {showSearch ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Search formulations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      background: 'var(--bg-surface-muted)',
                      border: '1px solid var(--accent-gold)',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)',
                      width: '140px',
                      outline: 'none'
                    }}
                  />
                  <button 
                    onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSearch(true)}
                  title="Search formulations"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-primary)', padding: '6px'
                  }}
                >
                  <Search size={19} />
                </button>
              )}
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '6px'
              }}
            >
              {darkMode ? <Sun size={19} color="#E0C084" /> : <Moon size={19} />}
            </button>

            {/* User Profile / Auth Dropdown */}
            <div style={{ position: 'relative' }}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(prev => !prev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--bg-surface-muted)',
                      border: '1px solid var(--border-color)',
                      padding: '6px 12px',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <User size={14} color="var(--accent-gold)" />
                    <span style={{ maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="glass-panel"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: '180px',
                        borderRadius: '12px',
                        padding: '8px 0',
                        boxShadow: 'var(--shadow-md)',
                        zIndex: 1100
                      }}
                    >
                      <button
                        onClick={() => { handleNav('profile'); setUserDropdownOpen(false); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 16px',
                          background: 'none',
                          border: 'none',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          color: 'var(--text-primary)'
                        }}
                      >
                        My Orders & Profile
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { handleNav('admin'); setUserDropdownOpen(false); }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '10px 16px',
                            background: 'none',
                            border: 'none',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            color: 'var(--accent-gold)'
                          }}
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                      <button
                        onClick={() => {
                          resetClientCartOnLogout();
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 16px',
                          background: 'none',
                          border: 'none',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          color: 'var(--accent-crimson)'
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.76rem' }}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Cart Bag Icon with Count */}
            <button
              onClick={openCart}
              title="Shopping Bag"
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                padding: '6px'
              }}
            >
              <ShoppingBag size={21} />
              {totalItemsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-4px',
                  background: 'var(--accent-gold)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            top: '58px',
            left: 0,
            right: 0,
            zIndex: 999,
            padding: '20px 24px 28px',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <button 
            onClick={() => handleNav('home', 'products-section')}
            style={{
              background: 'none', border: 'none', textAlign: 'left',
              fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text-primary)', fontWeight: 600, padding: '8px 0',
              cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            🌿 Formulations
          </button>
          <button 
            onClick={() => handleNav('home', 'story-section')}
            style={{
              background: 'none', border: 'none', textAlign: 'left',
              fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text-primary)', fontWeight: 600, padding: '8px 0',
              cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            📜 Founder's Story
          </button>
          <button 
            onClick={() => handleNav('home', 'process-section')}
            style={{
              background: 'none', border: 'none', textAlign: 'left',
              fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text-primary)', fontWeight: 600, padding: '8px 0',
              cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            🏺 Kshir Pak Vidhi Ritual
          </button>
          <button 
            onClick={() => handleNav('home', 'contact-section')}
            style={{
              background: 'none', border: 'none', textAlign: 'left',
              fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text-primary)', fontWeight: 600, padding: '8px 0',
              cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            📞 Contact Sanctuary
          </button>

          {user ? (
            <button 
              onClick={() => handleNav('profile')}
              style={{
                background: 'none', border: 'none', textAlign: 'left',
                fontFamily: 'var(--font-sans)', fontSize: '0.95rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--accent-gold)', fontWeight: 600, padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              👤 My Orders & Profile
            </button>
          ) : (
            <button 
              onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
              className="btn-primary"
              style={{ width: '100%', marginTop: '6px', padding: '12px 0', fontSize: '0.88rem' }}
            >
              Sign In to Sanctuary
            </button>
          )}
        </div>
      )}
    </>
  );
}
