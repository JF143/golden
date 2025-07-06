import React, { useState } from "react";
import { supabase } from '../lib/supabaseClient';

const SignUp = () => {
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '', first_name: '', last_name: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!agreed) {
      setMessage("You must agree to the terms and privacy policy.");
      return;
    }
    setLoading(true);
    // 1. Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
          first_name: form.first_name,
          last_name: form.last_name,
        }
      }
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    // 2. Insert into user table
    const user = data.user;
    console.log('Supabase Auth user:', user);
    if (user) {
      const { error: insertError } = await supabase.from('user').insert([
        {
          email: user.email,
          username: form.username,
          first_name: form.first_name,
          last_name: form.last_name
        }
      ]);
      console.log('Insert error:', insertError);
      if (insertError) {
        setMessage('Account created, but failed to save user profile: ' + insertError.message);
        setLoading(false);
        return;
      }
    } else {
      setMessage('Account created, but no user object returned from Supabase Auth.');
    }
    setMessage('Account created! Please check your email to confirm your account.');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff"
    }}>
      <div style={{
        width: 350,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: 32,
        marginTop: 40
      }}>
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#1976d2",
              marginBottom: 8
            }}
            aria-label="Go back"
          >
            &#8592;
          </button>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#222" }}>Create Account</h1>
          <p style={{ margin: "8px 0 0 0", color: "#555" }}>Please fill in the form to create your account</p>
        </div>
        {message && <div style={{ marginBottom: 18, color: message.includes('created') ? '#006421' : '#c72a00', background: message.includes('created') ? '#e6ffed' : '#ffebe6', border: '1px solid', borderColor: message.includes('created') ? '#a3e2b4' : '#ffc4b3', padding: '12px 15px', borderRadius: 6, textAlign: 'center', fontSize: 15 }}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            required
            style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="First Name"
            value={form.first_name}
            onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
            required
            style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.last_name}
            onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
            required
            style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            style={{ width: '100%', padding: '10px', marginBottom: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <div className="terms-container" style={{ marginBottom: 18 }}>
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ marginRight: 8, accentColor: "#1976d2", background: "#fff" }}
              required
            />
            <label htmlFor="terms" style={{ color: "#555", fontSize: 14 }}>
              I agree to the <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>Terms & Conditions</a> and <a href="#" style={{ color: "#1976d2", textDecoration: "none" }}>Privacy Policy</a>.
            </label>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 10
            }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 15 }}>
          Already have an account? <a href="/sign-in" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 