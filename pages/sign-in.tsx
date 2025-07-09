"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("User already logged in, checking profile...")
          await handleUserRedirect(session.user.id)
        }
      } catch (error) {
        console.error("Error checking user session:", error)
      }
    }
    checkUser()
  }, [])

  const handleUserRedirect = async (userId: string) => {
    try {
      // Try to get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", userId)
        .single()

      console.log("Profile data:", profile, "Profile error:", profileError)

      let userType = "customer" // default fallback

      // Check localStorage first (from landing page selection)
      const selectedUserType = typeof window !== "undefined" ? localStorage.getItem("userType") : null

      if (selectedUserType) {
        userType = selectedUserType
        localStorage.removeItem("userType")
        console.log("Using selected user type from localStorage:", userType)
      } else if (profile && profile.user_type) {
        userType = profile.user_type
        console.log("Using user type from profile:", userType)
      } else {
        console.log("No profile found, using default user type:", userType)

        // Create a default profile if it doesn't exist
        try {
          const { error: insertError } = await supabase.from("profiles").insert([
            {
              id: userId,
              user_type: userType,
              created_at: new Date().toISOString(),
            },
          ])

          if (insertError) {
            console.log("Could not create profile, continuing with default:", insertError)
          } else {
            console.log("Created default profile for user")
          }
        } catch (insertError) {
          console.log("Profile creation failed, continuing:", insertError)
        }
      }

      // Always stop loading before redirect
      setLoading(false);

      // Redirect based on user type
      setTimeout(() => {
        if (userType === "shop") {
          console.log("Redirecting to dashboard...")
          router.push("/dashboard")
        } else {
          console.log("Redirecting to home...")
          router.push("/home")
        }
      }, 500)
    } catch (error) {
      console.error("Error in handleUserRedirect:", error)
      setLoading(false);
      // Default to customer home if there's any error
      router.push("/home")
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Starting sign in process...")

      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (signInError) {
        console.error("Sign in error:", signInError)
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials and try again.")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Please check your email and click the confirmation link before signing in.")
        } else {
          setError(signInError.message || "An error occurred during sign in")
        }
        setLoading(false)
        return
      }

      if (data?.user) {
        console.log("User signed in successfully:", data.user.email)
        await handleUserRedirect(data.user.id)
      } else {
        setLoading(false)
      }
    } catch (error: any) {
      console.error("Unexpected sign in error:", error)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      })

      if (error) {
        console.error("Google sign in error:", error)
        setError("Failed to sign in with Google. Please try again.")
        setLoading(false)
      }
    } catch (error) {
      console.error("Google sign in error:", error)
      setError("An error occurred with Google sign in. Please try again.")
      setLoading(false)
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
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "8px",
            }}
          >
            Sign In
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>Welcome back! Please sign in to continue</p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#fee",
              color: "#c33",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "14px",
              border: "1px solid #fcc",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                backgroundColor: loading ? "#f5f5f5" : "white",
                color: "#111", // set text color to black
                boxSizing: "border-box",
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "45px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                  backgroundColor: loading ? "#f5f5f5" : "white",
                  color: "#111", // set text color to black
                  boxSizing: "border-box",
                }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#666" }}>
              <input
                type="checkbox"
                style={{
                  marginRight: "8px",
                  width: "16px",
                  height: "16px",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  background: "#fff",
                  border: "1.5px solid #bbb",
                  borderRadius: "4px",
                  outline: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "inline-block",
                  verticalAlign: "middle",
                  position: "relative",
                }}
                disabled={loading}
              />
              Remember me
            </label>
            <a
              href="/reset-password"
              style={{
                color: "#E2B24A",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#ccc" : "#E2B24A",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
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
              fontSize: "14px",
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
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "white",
            color: "#333",
            border: "1px solid #ddd",
            padding: "14px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            marginBottom: "20px",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "#f8f9fa"
              e.currentTarget.style.borderColor = "#E2B24A"
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "white"
              e.currentTarget.style.borderColor = "#ddd"
            }
          }}
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
          {loading ? "Signing In..." : "Continue with Google"}
        </button>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Don't have an account?{" "}
            <a
              href="/register"
              style={{
                color: "#E2B24A",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}