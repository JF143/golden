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
        backgroundImage: "url('/img/Golden Bites.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Background overlay for better text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(226, 178, 74, 0.3)", // Golden overlay with transparency
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 2,
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#333", marginBottom: 8, textAlign: "center" }}>Register</h1>
        <p style={{ margin: "0 0 24px 0", color: "#666", fontSize: 16, textAlign: "center" }}>Create your customer account</p>

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

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: 6, color: "#333", fontWeight: 500 }}>
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
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: 6,
                fontSize: 16,
                backgroundColor: isLoading ? "#f5f5f5" : "white",
                color: "#111",
                opacity: isLoading ? 0.6 : 1,
                boxSizing: "border-box",
              }}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: 6, color: "#333", fontWeight: 500 }}>
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
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: 6,
                fontSize: 16,
                backgroundColor: isLoading ? "#f5f5f5" : "white",
                color: "#111",
                opacity: isLoading ? 0.6 : 1,
                boxSizing: "border-box",
              }}
              required
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: 6, color: "#333", fontWeight: 500 }}>
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
                  padding: "12px",
                  paddingRight: "45px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 16,
                  backgroundColor: isLoading ? "#f5f5f5" : "white",
                  color: "#111",
                  opacity: isLoading ? 0.6 : 1,
                  boxSizing: "border-box",
                }}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: 6, color: "#333", fontWeight: 500 }}>
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
                  padding: "12px",
                  paddingRight: "45px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: 16,
                  backgroundColor: isLoading ? "#f5f5f5" : "white",
                  color: "#111",
                  opacity: isLoading ? 0.6 : 1,
                  boxSizing: "border-box",
                }}
                required
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  color: "#666",
                  fontSize: 14,
                }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              backgroundColor: isLoading ? "#ccc" : "#E2B24A",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
              marginBottom: 10,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>
        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#ddd",
            }}
          />
          <span
            style={{
              padding: "0 15px",
              color: "#666",
              fontSize: 14,
            }}
          >
            or
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "#ddd",
            }}
          />
        </div>
        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: "white",
            color: "#333",
            border: "1px solid #ddd",
            padding: "14px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 500,
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            marginBottom: "20px",
          }}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? "Signing In..." : "Continue with Google"}
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 14 }}>
            Already have an account?{" "}
            <a
              href="/sign-in"
              style={{
                color: "#E2B24A",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
