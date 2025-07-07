"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useUser } from "../lib/userContext"

const useResponsive = () => {
  const [isWide, setIsWide] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 1100)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isWide
}

const LandingPage = () => {
  const isWide = useResponsive()
  const router = useRouter()
  const { user, profile } = useUser()

  // Redirect authenticated users
  useEffect(() => {
    if (user && profile) {
      if (profile.user_type === "customer") {
        router.push("/home")
      } else if (profile.user_type === "shop") {
        router.push("/dashboard")
      }
    }
  }, [user, profile, router])

  const handleOrderFood = () => {
    router.push("/sign-in?type=customer")
  }

  const handleSellFood = () => {
    router.push("/sign-in?type=shop")
  }

  const handleBrowseRestaurants = () => {
    router.push("/shop-products")
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #E2B24A 0%, #D4A043 50%, #C69236 100%)",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          opacity: 0.6,
        }}
      />

      <div
        style={{
          maxWidth: isWide ? 1400 : 900,
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: isWide ? "0 48px" : "0 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 0",
            marginBottom: isWide ? "60px" : "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/img/golden-bites-logo.png"
              alt="Golden Bites"
              style={{
                width: isWide ? "60px" : "50px",
                height: isWide ? "60px" : "50px",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontSize: isWide ? "24px" : "20px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Golden Bites
            </span>
          </div>
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Link
              href="/shop-products"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: isWide ? "16px" : "14px",
                fontWeight: "500",
              }}
            >
              Features
            </Link>
            <Link
              href="/about"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: isWide ? "16px" : "14px",
                fontWeight: "500",
              }}
            >
              About
            </Link>
            <Link
              href="/sign-in"
              style={{
                background: "white",
                color: "#E2B24A",
                padding: "10px 20px",
                borderRadius: "25px",
                textDecoration: "none",
                fontSize: isWide ? "16px" : "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
            >
              Sign in
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
            gap: isWide ? "80px" : "40px",
            flexDirection: isWide ? "row" : "column",
            textAlign: isWide ? "left" : "center",
          }}
        >
          {/* Left Content */}
          <div style={{ flex: 1, maxWidth: isWide ? "600px" : "100%" }}>
            <h1
              style={{
                fontSize: isWide ? "64px" : "48px",
                fontWeight: "bold",
                color: "white",
                lineHeight: "1.1",
                marginBottom: "24px",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Campus Food
              <br />
              Delivered Right
            </h1>

            <p
              style={{
                fontSize: isWide ? "20px" : "18px",
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: "1.6",
                marginBottom: "40px",
                maxWidth: "500px",
              }}
            >
              Order delicious meals from your favorite campus restaurants and get them delivered straight to your dorm,
              classroom, or anywhere on campus.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "32px",
                flexDirection: isWide ? "row" : "column",
                alignItems: isWide ? "flex-start" : "center",
              }}
            >
              <button
                onClick={handleOrderFood}
                style={{
                  background: "white",
                  color: "#E2B24A",
                  border: "none",
                  padding: "16px 32px",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                }}
              >
                🍽️ Order Food
              </button>

              <button
                onClick={handleSellFood}
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  padding: "16px 32px",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.color = "#E2B24A"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "white"
                }}
              >
                🏪 Sell Food
              </button>
            </div>

            {/* Browse Option */}
            <div style={{ marginTop: "24px" }}>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                Or browse restaurants:
              </p>
              <button
                onClick={handleBrowseRestaurants}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
                }}
              >
                🔍 Browse Restaurants
              </button>
            </div>
          </div>

          {/* Right Content - Delivery Icon */}
          <div
            style={{
              flex: isWide ? "0 0 400px" : "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: isWide ? "350px" : "280px",
                height: isWide ? "350px" : "280px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: isWide ? "120px" : "100px",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                }}
              >
                🚴‍♂️
              </div>
            </div>
          </div>
        </main>

        {/* Why Choose Section */}
        <section
          style={{
            marginTop: isWide ? "100px" : "60px",
            marginBottom: isWide ? "80px" : "60px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: isWide ? "48px" : "36px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "60px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Why Choose Golden Bites?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isWide ? "repeat(3, 1fr)" : "1fr",
              gap: "40px",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "40px 30px",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚡</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "white",
                  marginBottom: "16px",
                }}
              >
                Fast Delivery
              </h3>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              >
                Get your food delivered in 15-30 minutes anywhere on campus
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "40px 30px",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>🍽️</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "white",
                  marginBottom: "16px",
                }}
              >
                Quality Food
              </h3>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              >
                Fresh, delicious meals from trusted campus restaurants
              </p>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "40px 30px",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>💰</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "white",
                  marginBottom: "16px",
                }}
              >
                Student Friendly
              </h3>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              >
                Affordable prices and special student discounts
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "40px",
            paddingBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isWide ? "row" : "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/img/golden-bites-logo.png"
              alt="Golden Bites"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Golden Bites
            </span>
          </div>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "14px",
            }}
          >
            © 2024 Golden Bites. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
