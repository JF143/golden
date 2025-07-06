import React, { useState } from "react";
import { supabase } from '../lib/supabaseClient';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase Auth login
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      alert(error.message);
      return;
    }
    // Redirect based on userType (if set from landing page)
    const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;
    if (userType === 'customer') {
      localStorage.removeItem('userType');
      window.location.href = "/";
    } else if (userType === 'merchant') {
      localStorage.removeItem('userType');
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f2f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff",
        padding: 40,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 420,
      }}>
        <div style={{ textAlign: 'left', marginBottom: 30 }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1c1e21', marginBottom: 5 }}>Sign In</h1>
          <p style={{ fontSize: 15, color: '#606770' }}>Welcome back! Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 500, fontSize: 14, color: '#333', marginBottom: 8 }}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ccd0d5',
                borderRadius: 6,
                fontSize: 15,
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                background: '#fff',
                color: '#222',
              }}
              placeholder="Email"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 500, fontSize: 14, color: '#333', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 15px',
                  border: '1px solid #ccd0d5',
                  borderRadius: 6,
                  fontSize: 15,
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  background: '#fff',
                  color: '#222',
                }}
                placeholder="Password"
              />
              <span
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  height: 20,
                  width: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? "/img/eye-open.png" : "/img/eye-close.png"}
                  alt={showPassword ? "Hide password" : "Show password"}
                  style={{ width: 20, height: 20, opacity: 0.6 }}
                />
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, fontSize: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" id="remember" style={{ marginRight: 8, width: 'auto' }} />
              <label htmlFor="remember" style={{ fontWeight: 'normal', color: '#606770', marginBottom: 0 }}>Remember me</label>
            </div>
            <a href="/reset-password" style={{ color: '#1877f2', textDecoration: 'none' }}>Forgot password?</a>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 12,
              background: '#1877f2',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Sign In
          </button>
        </form>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#606770', marginTop: 25 }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#1877f2', textDecoration: 'none', fontWeight: 500 }}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 