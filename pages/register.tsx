import React, { useState } from "react";
import { supabase } from '../lib/supabaseClient';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Supabase Auth registration
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      alert(error.message);
      return;
    }
    // Insert into user table
    const user = data.user;
    // Split name into first and last name if possible
    let first_name = name;
    let last_name = '';
    if (name.includes(' ')) {
      const parts = name.split(' ');
      first_name = parts[0];
      last_name = parts.slice(1).join(' ');
    }
    if (user) {
      const { error: insertError } = await supabase.from('user').insert([
        {
          email: user.email,
          username: user.email, // using email as username for now
          first_name,
          last_name,
          password: '', // do not store password in user table
          is_staff: false,
          is_active: true,
          is_superuser: false,
          user_type: 'customer',
        }
      ]);
      if (insertError) {
        alert('Account created, but failed to save user profile: ' + insertError.message);
        return;
      }
    }
    alert('Registration successful! Please check your email to confirm your account.');
    window.location.href = '/sign-in';
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f8fc",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100vw"
    }}>
      <div style={{
        width: 400,
        maxWidth: "90vw",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: 36,
        marginTop: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", marginBottom: 8 }}>Register</h1>
        <p style={{ margin: "0 0 24px 0", color: "#555", fontSize: 15 }}>Create your customer account</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}>Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 16,
                background: "#f9fafb",
                color: "#222"
              }}
              required
              placeholder="Full Name"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 16,
                background: "#f9fafb",
                color: "#222"
              }}
              required
              placeholder="Email"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 16,
                  background: "#f9fafb",
                  color: "#222"
                }}
                required
                placeholder="Password"
              />
              <span
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? "/img/eye-open.png" : "/img/eye-close.png"}
                  alt={showPassword ? "Hide password" : "Show password"}
                  style={{ width: 22, height: 22 }}
                />
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 16,
                  background: "#f9fafb",
                  color: "#222"
                }}
                required
                placeholder="Confirm Password"
              />
              <span
                onClick={() => setShowConfirmPassword(s => !s)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showConfirmPassword ? "/img/eye-open.png" : "/img/eye-close.png"}
                  alt={showConfirmPassword ? "Hide password" : "Show password"}
                  style={{ width: 22, height: 22 }}
                />
              </span>
            </div>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#3887f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 10
            }}
          >
            Register
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 15 }}>
          <span style={{ color: '#222' }}>Already have an account? </span>
          <a href="/sign-in" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}>Sign in</a>
        </div>
        <div style={{ marginTop: 18 }}>
          <button
            style={{
              width: "100%",
              padding: "10px 0",
              background: "#fff",
              color: "#222",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            type="button"
          >
            <img src="/img/google.png" alt="Google" style={{ width: 20, height: 20, marginRight: 8 }} />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register; 