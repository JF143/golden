"use client"

import React, { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

const gold = "#E2B24A"

const useResponsive = () => {
  const [isWide, setIsWide] = useState(false)
  React.useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 1100)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isWide
}

const Landing = () => {
  const router = useRouter()
  const isWide = useResponsive()

  const handleUserTypeSelection = (userType: "customer" | "merchant") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userType", userType)
    }
    router.push("/sign-in")
  }

  return (
    <>
      <Head>
        <title>Golden Bites - Campus Food Delivery</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${gold} 0%, #d4a043 100%)`,
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: isWide ? "20px 40px" : "16px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: gold,
                fontWeight: 700,
              }}
            >
              GB
            </div>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Golden Bites</span>
          </div>
          <nav style={{ display: "flex", gap: isWide ? 32 : 20, alignItems: "center" }}>
            <a href="#features" style={{ color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: 500 }}>
              Features
            </a>
            <a href="#about" style={{ color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: 500 }}>
              About
            </a>
            <button
              onClick={() => router.push("/sign-in")}
              style={{
                background: "#fff",
                color: gold,
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Sign In
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", padding: isWide ? "0 40px" : "0 20px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isWide ? "1fr 1fr" : "1fr",
                gap: isWide ? 60 : 40,
                alignItems: "center",
              }}
            >
              {/* Left Content */}
              <div style={{ color: "#fff", textAlign: isWide ? "left" : "center" }}>
                <h1
                  style={{
                    fontSize: isWide ? 56 : 40,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: 24,
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Campus Food
                  <br />
                  <span style={{ color: "#fff3cd" }}>Delivered Right</span>
                </h1>
                <p
                  style={{
                    fontSize: isWide ? 20 : 18,
                    lineHeight: 1.6,
                    marginBottom: 40,
                    opacity: 0.9,
                    maxWidth: 500,
                    margin: isWide ? "0 0 40px 0" : "0 auto 40px auto",
                  }}
                >
                  Order delicious meals from your favorite campus restaurants and get them delivered straight to your
                  dorm, classroom, or anywhere on campus.
                </p>

                {/* CTA Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexDirection: isWide ? "row" : "column",
                    alignItems: "center",
                    justifyContent: isWide ? "flex-start" : "center",
                  }}
                >
                  <button
                    onClick={() => handleUserTypeSelection("customer")}
                    style={{
                      background: "#fff",
                      color: gold,
                      border: "none",
                      borderRadius: 12,
                      padding: "16px 32px",
                      fontSize: 18,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      minWidth: 200,
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)"
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"
                    }}
                  >
                    <i className="fas fa-utensils"></i>
                    Order Food
                  </button>
                  <button
                    onClick={() => handleUserTypeSelection("merchant")}
                    style={{
                      background: "transparent",
                      color: "#fff",
                      border: "2px solid #fff",
                      borderRadius: 12,
                      padding: "14px 32px",
                      fontSize: 18,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      transition: "all 0.2s ease",
                      minWidth: 200,
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fff"
                      e.currentTarget.style.color = gold
                      e.currentTarget.style.transform = "translateY(-3px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent"
                      e.currentTarget.style.color = "#fff"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    <i className="fas fa-store"></i>
                    Sell Food
                  </button>
                </div>

                {/* Quick Browse */}
                <div style={{ marginTop: 40 }}>
                  <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 16 }}>Or browse restaurants:</p>
                  <button
                    onClick={() => router.push("/shop-products")}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 8,
                      padding: "12px 24px",
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.2s ease",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.3)"
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"
                    }}
                  >
                    <i className="fas fa-search"></i>
                    Browse Restaurants
                  </button>
                </div>
              </div>

              {/* Right Content - Illustration */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  order: isWide ? 2 : -1,
                }}
              >
                <div
                  style={{
                    width: isWide ? 400 : 280,
                    height: isWide ? 400 : 280,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <i
                    className="fas fa-motorcycle"
                    style={{
                      fontSize: isWide ? 120 : 80,
                      color: "#fff",
                      opacity: 0.8,
                    }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section
          id="features"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: isWide ? "80px 40px" : "60px 20px",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2
              style={{
                fontSize: isWide ? 40 : 32,
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                marginBottom: 60,
              }}
            >
              Why Choose Golden Bites?
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isWide ? "repeat(3, 1fr)" : "1fr",
                gap: 40,
              }}
            >
              {[
                {
                  icon: "fas fa-bolt",
                  title: "Fast Delivery",
                  description: "Get your food delivered in 15-30 minutes anywhere on campus",
                },
                {
                  icon: "fas fa-shield-alt",
                  title: "Safe & Secure",
                  description: "Secure payments and contactless delivery for your safety",
                },
                {
                  icon: "fas fa-heart",
                  title: "Campus Favorites",
                  description: "Discover the best local restaurants loved by students",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <i className={feature.icon} style={{ fontSize: 32 }}></i>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{feature.title}</h3>
                  <p style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.6 }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            background: "rgba(0,0,0,0.2)",
            padding: "40px 20px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: gold,
                  fontWeight: 700,
                }}
              >
                GB
              </div>
              <span style={{ fontSize: 18, fontWeight: 600 }}>Golden Bites</span>
            </div>
            <p style={{ opacity: 0.8, marginBottom: 20 }}>Made for Campus Life. Delivered Right.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
              <a href="#" style={{ color: "#fff", fontSize: 20, opacity: 0.8 }}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" style={{ color: "#fff", fontSize: 20, opacity: 0.8 }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ color: "#fff", fontSize: 20, opacity: 0.8 }}>
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Landing
