"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/router"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          // Check user type from localStorage and redirect accordingly
          const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null
          if (userType === "merchant") {
            localStorage.removeItem("userType")
            router.push("/dashboard")
          } else {
            if (userType) localStorage.removeItem("userType")
            router.push("/home")
          }
        }
      } catch (error) {
        console.error("Error checking user session:", error)
      }
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Starting sign in process...")

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      console.log("Auth response:", { data, error: authError })

      if (authError) {
        throw authError
      }

      if (data.user) {
        console.log("Sign in successful, redirecting...")

        // Small delay to ensure session is properly set
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check user type and redirect accordingly
        const userType = typeof window !== "undefined" ? localStorage.getItem("userType") : null

        if (userType === "merchant") {
          localStorage.removeItem("userType")
          window.location.href = "/dashboard"
        } else {
          if (userType) localStorage.removeItem("userType")
          window.location.href = "/home"
        }
      }
    } catch (error: any) {
      console.error("Sign in error:", error)

      // Handle specific error types
      if (error.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.")
      } else if (error.message?.includes("Email not confirmed")) {
        setError("Please check your email and confirm your account before signing in.")
      } else if (error.message?.includes("Too many requests")) {
        setError("Too many login attempts. Please wait a moment and try again.")
      } else {
        setError(error.message || "Sign in failed. Please try again.")
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
        background: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <div style={{ textAlign: "left", marginBottom: 30 }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: "#1c1e21", marginBottom: 5 }}>Sign In</h1>
          <p style={{ fontSize: 15, color: "#606770" }}>Welcome back! Please sign in to continue</p>
        </div>

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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="email"
              style={{ display: "block", fontWeight: 500, fontSize: 14, color: "#333", marginBottom: 8 }}
            >
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
                padding: "12px 15px",
                border: "1px solid #ccd0d5",
                borderRadius: 6,
                fontSize: 15,
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
                background: "#fff",
                color: "#222",
                opacity: isLoading ? 0.6 : 1,
              }}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label
              htmlFor="password"
              style={{ display: "block", fontWeight: 500, fontSize: 14, color: "#333", marginBottom: 8 }}
            >
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
                  padding: "12px 40px 12px 15px",
                  border: "1px solid #ccd0d5",
                  borderRadius: 6,
                  fontSize: 15,
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  background: "#fff",
                  color: "#222",
                  opacity: isLoading ? 0.6 : 1,
                }}
                placeholder="Enter your password"
                required
              />
              <span
                onClick={() => !isLoading && setShowPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  height: 20,
                  width: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isLoading ? 0.4 : 0.6,
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
              fontSize: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" id="remember" style={{ marginRight: 8, width: "auto" }} disabled={isLoading} />
              <label htmlFor="remember" style={{ fontWeight: "normal", color: "#606770", marginBottom: 0 }}>
                Remember me
              </label>
            </div>
            <a href="/reset-password" style={{ color: "#1877f2", textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 12,
              background: isLoading ? "#ccc" : "#1877f2",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: 14, color: "#606770", marginTop: 25, marginBottom: 20 }}>
          {"Don't have an account? "}
          <a href="/register" style={{ color: "#1877f2", textDecoration: "none", fontWeight: 500 }}>
            Sign Up
          </a>
        </div>

        <div style={{ textAlign: "center", marginBottom: 15, position: "relative" }}>
          <div style={{ borderTop: "1px solid #dadde1", margin: "0 20px" }}></div>
          <span
            style={{
              background: "#fff",
              color: "#606770",
              fontSize: 12,
              padding: "0 15px",
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            OR
          </span>
        </div>

        <button
          type="button"
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
        >
          <span style={{ fontSize: 18 }}>🔍</span>
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default SignIn
