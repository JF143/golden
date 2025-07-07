"use client"

import { useState, useEffect } from "react"

const cardStyles = {
  flex: 1,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  overflow: "hidden",
  transition: "all 0.3s ease",
  border: "2px solid transparent",
  minWidth: 260,
  maxWidth: 420,
  margin: "0 10px",
  display: "flex",
  flexDirection: "column" as const,
}

const Landing = () => {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 900)
    checkWidth()
    window.addEventListener("resize", checkWidth)
    return () => window.removeEventListener("resize", checkWidth)
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f0f7ff, #ffffff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        width: "100vw",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          background: "#fff0",
          position: "relative",
          borderRadius: 0,
          maxWidth: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 20px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "#f0f0f0",
                margin: "0 auto 15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <img
                src="/img/logo.png"
                alt="Golden Bites Logo"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h1 style={{ fontSize: 24, color: "#333", marginBottom: 5 }}>Welcome to Golden Bites</h1>
            <p style={{ color: "#666", maxWidth: "80%", margin: "0 auto", fontSize: 14 }}>
              The ultimate food ordering platform connecting hungry customers with amazing restaurants
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              gap: 20,
              width: "100%",
              justifyContent: "center",
              alignItems: "stretch",
              marginBottom: 30,
              flexWrap: "wrap",
            }}
          >
            <div style={cardStyles}>
              <div style={{ padding: 15, textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                <h2 style={{ fontSize: 18, color: "#4a90e2", marginBottom: 5 }}>I'm a Customer</h2>
                <p style={{ fontSize: 12, color: "#888" }}>Looking to order delicious food</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "#f0f7ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ width: 40, height: 40, color: "#4a90e2" }}>
                    {/* Shopping bag SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2L3 6v20h18V6l-3-4z" />
                      <path d="M10.3 17.3a2 2 0 1 0 3.4 0" />
                    </svg>
                  </span>
                </div>
              </div>
              <div style={{ padding: 15, textAlign: "center", borderTop: "1px solid #f0f0f0" }}>
                <a
                  href="/sign-in"
                  style={{
                    display: "inline-block",
                    background: "#4a90e2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background-color 0.2s",
                    width: "100%",
                  }}
                  onClick={() => {
                    localStorage.setItem("userType", "customer")
                  }}
                >
                  Continue as Customer
                </a>
              </div>
            </div>
            <div style={cardStyles}>
              <div style={{ padding: 15, textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                <h2 style={{ fontSize: 18, color: "#4a90e2", marginBottom: 5 }}>I'm a Merchant</h2>
                <p style={{ fontSize: 12, color: "#888" }}>Looking to sell my food</p>
              </div>
              <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "#f0f7ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ width: 40, height: 40, color: "#4a90e2" }}>
                    {/* Store SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 22h16" />
                      <path d="M4 4l16 0 0 6-16 0z" />
                      <path d="M12 10v12" />
                    </svg>
                  </span>
                </div>
              </div>
              <div style={{ padding: 15, textAlign: "center", borderTop: "1px solid #f0f0f0" }}>
                <a
                  href="/sign-in"
                  style={{
                    display: "inline-block",
                    background: "#4a90e2",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background-color 0.2s",
                    width: "100%",
                  }}
                  onClick={() => {
                    localStorage.setItem("userType", "merchant")
                  }}
                >
                  Continue as Merchant
                </a>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12 }}>
            <p style={{ color: "#888", marginBottom: 3 }}>
              New to Golden Bites?{" "}
              <a href="/register" style={{ color: "#4a90e2", textDecoration: "none" }}>
                Create a customer account
              </a>
            </p>
            <p style={{ color: "#888", marginBottom: 3 }}>
              New to Golden Bites as a merchant?{" "}
              <a href="/sign-up" style={{ color: "#4a90e2", textDecoration: "none" }}>
                Become a merchant
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
