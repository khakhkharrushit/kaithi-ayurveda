import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('kaithi_token') || null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' or 'register'
  const [authModalPrompt, setAuthModalPrompt] = useState('');
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Session expired');
        })
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleAuthSuccess = (userData) => {
    setIsAuthModalOpen(false);
    setAuthModalPrompt('');
    if (authSuccessCallback) {
      const cb = authSuccessCallback;
      setAuthSuccessCallback(null);
      cb(userData);
    }
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('kaithi_token', data.token);
    handleAuthSuccess(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('kaithi_token', data.token);
    handleAuthSuccess(data.user);
    return data.user;
  };

  const sendEmailOtp = async (email) => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
    return data;
  };

  const verifyEmailOtp = async (email, otp, name) => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid verification code');
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('kaithi_token', data.token);
    handleAuthSuccess(data.user);
    return data.user;
  };

  const loginWithGoogle = async (credential) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Google sign-in failed');
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('kaithi_token', data.token);
    handleAuthSuccess(data.user);
    return data.user;
  };

  const updateProfile = async (formData) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Profile update failed');
    setUser(data.user);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('kaithi_token', data.token);
    }
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kaithi_token');
  };

  const openAuthModal = (tab = 'login', prompt = '', onSuccess = null) => {
    setAuthModalTab(tab);
    setAuthModalPrompt(prompt);
    setAuthSuccessCallback(() => onSuccess);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalPrompt('');
    setAuthSuccessCallback(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      sendEmailOtp,
      verifyEmailOtp,
      loginWithGoogle,
      updateProfile,
      logout,
      isAuthModalOpen,
      authModalTab,
      authModalPrompt,
      openAuthModal,
      closeAuthModal,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
