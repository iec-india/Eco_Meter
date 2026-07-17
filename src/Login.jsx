import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { supabase } from "./config/supabaseClient";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Google Login को हैंडल करने का सही फंक्शन
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // यह चेक करेगा कि ऐप मोबाइल (Android/iOS) में चल रहा है या वेब (Web) में
      const isNative = Capacitor.getPlatform() !== 'web';

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // अगर मोबाइल है तो ecometer:// यूज़ करें, अगर वेब है तो वर्तमान वेब एड्रेस यूज़ करें
          redirectTo: isNative ? 'ecometer://login-callback' : window.location.origin,
        },
      });
    } catch (error) {
      console.error('Error during Google login:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#eaf4f0' }}>
      <div className="login-card" style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%' }}>
        
        <span style={{ backgroundColor: '#eaf4f0', color: '#1e5631', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          Eco Meter
        </span>
        
        <h1 style={{ color: '#1e5631', margin: '24px 0', fontSize: '28px', lineHeight: '1.2' }}>
          Clean Schools · Happy Schools
        </h1>
        
        <p style={{ color: '#555', marginBottom: '30px', fontSize: '15px' }}>
          Sign in with your Google account to<br />continue the school evaluation.
        </p>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '12px', 
            border: '1px solid #b8d8c8', 
            backgroundColor: 'white', 
            color: '#1e5631', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '18px' }}>G</span> 
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <p style={{ fontSize: '12px', color: '#888', marginTop: '24px' }}>
          Only authorized evaluators can access this form.
        </p>
      </div>
    </div>
  );
};

export default Login;