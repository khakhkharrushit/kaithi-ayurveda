import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = '656605900168-sge1peb9qlioanomlmt143l9nfiie4ct.apps.googleusercontent.com';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    authModalPrompt,
    login,
    register,
    sendEmailOtp,
    verifyEmailOtp,
    loginWithGoogle
  } = useAuth();

  // Mode: 'otp' | 'password'
  const [authMethod, setAuthMethod] = useState('otp');
  const [tab, setTab] = useState('login'); // For password mode: 'login' | 'register'

  // OTP Flow
  const [otpStep, setOtpStep] = useState('email'); // 'email' | 'verify'
  const [otpEmail, setOtpEmail] = useState('');
  const [otpName, setOtpName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSentMsg, setOtpSentMsg] = useState('');

  // Password Flow
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Consent checkbox
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset when modal opens/closes
  useEffect(() => {
    if (authModalTab) setTab(authModalTab);
    if (!isAuthModalOpen) {
      setOtpStep('email');
      setOtpCode('');
      setError('');
      setLoading(false);
    }
  }, [authModalTab, isAuthModalOpen]);

  // Resend timer countdown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Google credential callback
  const handleGoogleCredential = useCallback(async (response) => {
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy to continue.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle(response.credential);
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [agreedToTerms, loginWithGoogle]);

  // Render Google Button using GSI
  const renderGoogleButton = useCallback(() => {
    const container = document.getElementById('kaithi-google-btn');
    if (!container || !window.google?.accounts?.id) return;
    container.innerHTML = '';
    window.google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'center',
      width: 320,
    });
  }, []);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const initGsi = () => {
      if (!window.google?.accounts?.id) return false;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      renderGoogleButton();
      return true;
    };

    if (!initGsi()) {
      const interval = setInterval(() => {
        if (initGsi()) clearInterval(interval);
      }, 250);
      return () => clearInterval(interval);
    }
  }, [isAuthModalOpen, handleGoogleCredential, renderGoogleButton]);

  if (!isAuthModalOpen) return null;

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await sendEmailOtp(otpEmail);
      setOtpStep('verify');
      setResendTimer(60);
      setOtpSentMsg(data.message || `Verification code sent to ${otpEmail}`);
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setError('Please enter the 6-digit code received on your email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyEmailOtp(otpEmail, otpCode.trim(), otpName);
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      await sendEmailOtp(otpEmail);
      setResendTimer(60);
      setOtpSentMsg(`A fresh verification code has been sent to ${otpEmail}`);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  // Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Password Register
  const handlePasswordRegister = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: '',
        address: '',
        city: 'Kodinar',
        state: 'Gujarat',
        pincode: '362720'
      });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div style={{
          padding: '22px 26px 14px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span className="luxury-subtitle">Kaithi Sanctuary</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.55rem', marginTop: '2px' }}>
              {authMethod === 'otp'
                ? (otpStep === 'email' ? 'Sign In / Register' : 'Verify Email')
                : (tab === 'login' ? 'Welcome Back' : 'Create Account')}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Prompt banner */}
        {authModalPrompt && (
          <div style={{
            background: 'var(--accent-gold-light)',
            borderBottom: '1px solid var(--accent-gold-border)',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: 'var(--accent-gold)',
            fontWeight: 500
          }}>
            <Sparkles size={16} />
            <span>{authModalPrompt}</span>
          </div>
        )}

        <div style={{ padding: '24px 26px' }}>
          {error && (
            <div style={{
              background: 'rgba(155, 44, 59, 0.1)',
              border: '1px solid rgba(155, 44, 59, 0.3)',
              color: 'var(--accent-crimson)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Terms Agreement Checkbox (Top) */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            marginBottom: '14px',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            background: 'rgba(201, 169, 110, 0.05)',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(201, 169, 110, 0.18)'
          }}>
            <input
              type="checkbox"
              id="agreeTermsTop"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={{ accentColor: 'var(--accent-gold)', width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer' }}
            />
            <label htmlFor="agreeTermsTop" style={{ cursor: 'pointer' }}>
              I agree to Kaithi Ayurveda's <strong>Terms of Service</strong> &amp; <strong>Privacy Policy</strong>.
            </label>
          </div>

          {/* Google Sign-In Official Button Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: agreedToTerms ? 1 : 0.45,
            pointerEvents: agreedToTerms ? 'auto' : 'none',
            transition: 'opacity 0.2s',
            marginBottom: '6px'
          }}>
            <div id="kaithi-google-btn" style={{ minHeight: '44px', display: 'flex', justifyContent: 'center' }} />
            {!agreedToTerms && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
                ☝️ Check the agreement above to enable Google Sign-In
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '16px 0',
            color: 'var(--text-muted)',
            fontSize: '0.74rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ padding: '0 12px' }}>or with email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          {/* Auth Method 1: Email OTP */}
          {authMethod === 'otp' ? (
            otpStep === 'email' ? (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                    />
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name (optional for new members)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="e.g. Radhika Mehta"
                      value={otpName}
                      onChange={(e) => setOtpName(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                    />
                    <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreedToTerms}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '13px 0',
                    fontSize: '0.86rem',
                    opacity: (loading || !agreedToTerms) ? 0.65 : 1,
                    marginTop: '8px'
                  }}
                >
                  {loading ? 'Sending Code...' : 'Send Verification OTP'} <ArrowRight size={15} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('password'); setError(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <KeyRound size={13} /> Sign in with Password instead
                  </button>
                </div>
              </form>
            ) : (
              /* OTP Code Input Step */
              <form onSubmit={handleVerifyOtp}>
                <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--accent-gold-light)',
                    color: 'var(--accent-gold)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <Mail size={20} />
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px' }}>
                    Enter Verification Code
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    We sent a 6-digit code to <strong>{otpEmail}</strong>
                  </p>
                </div>

                {otpSentMsg && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'var(--accent-forest-light)',
                    border: '1px solid var(--accent-sage)',
                    color: 'var(--accent-sage)',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    marginBottom: '14px',
                    textAlign: 'center'
                  }}>
                    {otpSentMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="form-input"
                    style={{
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      letterSpacing: '0.35em',
                      fontWeight: 700,
                      color: 'var(--accent-gold)',
                      padding: '10px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 4}
                  className="btn-primary"
                  style={{ width: '100%', padding: '13px 0', fontSize: '0.86rem', marginTop: '6px' }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.78rem' }}>
                  <button
                    type="button"
                    onClick={() => { setOtpStep('email'); setOtpCode(''); setError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    ← Change Email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--accent-gold)',
                      cursor: resendTimer > 0 ? 'default' : 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Auth Method 2: Password Login / Register */
            <div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '18px' }}>
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === 'login' ? '2px solid var(--accent-gold)' : 'none',
                    color: tab === 'login' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Password Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: 'none',
                    border: 'none',
                    borderBottom: tab === 'register' ? '2px solid var(--accent-gold)' : 'none',
                    color: tab === 'register' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  New Register
                </button>
              </div>

              {tab === 'login' ? (
                <form onSubmit={handlePasswordLogin}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '38px' }}
                      />
                      <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px 0', marginTop: '6px' }}
                  >
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordRegister}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        placeholder="Radhika Mehta"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '38px' }}
                      />
                      <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        placeholder="radhika@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '38px' }}
                      />
                      <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '38px' }}
                      />
                      <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px 0', marginTop: '6px' }}
                  >
                    {loading ? 'Creating...' : 'Agree & Create Account'}
                  </button>
                </form>
              )}

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('otp'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  ← Back to Email OTP Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
