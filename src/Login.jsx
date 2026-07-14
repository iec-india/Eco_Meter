import React, { useState } from 'react';
import { supabase } from './config/supabaseClient'; // Apna supabase path check kar lein

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const redirectUrl = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Login error:', error.message);
      alert('Login me error aaya. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand-block">
          <div className="login-badge">Eco Meter</div>
          <h1>Clean Schools · Happy Schools</h1>
          <p>Sign in with your Google account to continue the school evaluation.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="login-button"
        >
          <span className="login-button-icon">G</span>
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <p className="login-note">Only authorized evaluators can access this form.</p>
      </div>
    </div>
  );
}