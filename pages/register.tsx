"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/router"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push("/")
      }
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    if (!name.trim()) {
      setError("Please enter your full name.")
      setIsLoading(false)
      return
    }

    try {
      console.log("Starting registration process...")

      // Supabase Auth registration
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            name: name.trim(),
            full_name: name.trim(),
          },
        },
      })

      console.log("Auth response:", { data, error: authError })

      if (authError) {
        throw authError
      }

      const user = data.user

      if (user) {
        console.log("User created, now creating profile...")

        // Split name into first and last name if possible
        let first_name = name.trim()
        let last_name = ""
        if (name.includes(" ")) {
          const parts = name.trim().split(" ")
          first_name = parts[0]
          last_name = parts.slice(1).join(" ")
        }

        // Insert into user table with the correct user ID
        const { error: insertError } = await supabase.from("user").insert([
          {
            id: user.id, // This is the critical fix - include the user ID
            email: user.email,
            username: user.email, // using email as username for now
            first_name,
            last_name,
            password: "", // do not store password in user table
            is_staff: false,
            is_active: true,
            is_superuser: false,
            user_type: "customer",
          },
        ])

        console.log("Profile creation result:", { error: insertError })

        if (insertError) {
          console.error("Profile creation error:", insertError)
          // Don't fail registration if profile creation fails
          console.warn("Account created but profile creation failed:", insertError.message)
        }
      }

      if (data.user && !data.session) {
        setSuccess("Registration successful! Please check your email to confirm your account before signing in.")
      } else {
        setSuccess("Registration successful! Redirecting...")
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Registration error:", error)

      // Handle specific error types
      if (error.message?.includes("User already registered")) {
        setError("An account with this email already exists. Please sign in instead.")
      } else if (error.message?.includes("Password should be at least")) {
        setError("Password should be at least 6 characters long.")
      } else if (error.message?.includes("Unable to validate email address")) {
        setError("Please enter a valid email address.")
      } else if (error.message?.includes("Signup is disabled")) {
        setError("Registration is currently disabled. Please contact support.")
      } else {
        setError(error.message || "Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError("")
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError("Google sign-in failed: " + error.message)
      }
    } catch (error: any) {
      setError("Google sign-in failed: " + error.message)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f8fc",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <div
        style={{
          width: 400,
          maxWidth: "90vw",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: 36,
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#222", marginBottom: 8 }}>Register</h1>
        <p style={{ margin: "0 0 24px 0", color: "#555", fontSize: 15 }}>Create your customer account</p>

        {error && (
          <div
            style={{
              background: "#fee",
              border: "1px solid #fcc",
              color: "#c33",
              padding: 12,
              borderRadius: 6,
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#efe",
              border: "1px solid #cfc",
              color: "#3c3",
              padding: 12,
              borderRadius: 6,
              marginBottom: 20,
              fontSize: 14,
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 16,
                background: "#f9fafb",
                color: "#222",
                opacity: isLoading ? 0.6 : 1,
                boxSizing: "border-box",
              }}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 16,
                background: "#f9fafb",
                color: "#222",
                opacity: isLoading ? 0.6 : 1,
                boxSizing: "border-box",
              }}
              required
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 16,
                  background: "#f9fafb",
                  color: "#222",
                  opacity: isLoading ? 0.6 : 1,
                  boxSizing: "border-box",
                }}
                required
                placeholder="Enter your password"
              />
              <span
                onClick={() => !isLoading && setShowPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.4 : 1,
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="confirmPassword"
              style={{ display: "block", marginBottom: 6, color: "#222", fontWeight: 500 }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 16,
                  background: "#f9fafb",
                  color: "#222",
                  opacity: isLoading ? 0.6 : 1,
                  boxSizing: "border-box",
                }}
                required
                placeholder="Confirm your password"
              />
              <span
                onClick={() => !isLoading && setShowConfirmPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.4 : 1,
                }}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 0",
              background: isLoading ? "#ccc" : "#3887f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              marginBottom: 10,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 15 }}>
          <span style={{ color: "#222" }}>Already have an account? </span>
          <a href="/sign-in" style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </a>
        </div>
        <div style={{ marginTop: 18 }}>
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px 0",
              background: "#fff",
              color: "#222",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: isLoading ? 0.6 : 1,
            }}
            type="button"
          >
            <span style={{ fontSize: 18 }}>🔍</span>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
