"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabaseClient"
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

const ShopsList = () => {
  const [search, setSearch] = useState("")
  const isWide = useResponsive()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [dbStalls, setDbStalls] = useState<any[]>([])
  const { user, profile, loading: userLoading, signOut } = useUser()

  useEffect(() => {
    const fetchStalls = async () => {
      const { data, error } = await supabase.from("food_stall").select("id, stall_name, description, image_url, status")
      if (data) setDbStalls(data)
    }
    fetchStalls()
  }, [])

  const filteredStalls = dbStalls.filter(
    (stall) =>
      stall.stall_name.toLowerCase().includes(search.toLowerCase()) ||
      (stall.description && stall.description.toLowerCase().includes(search.toLowerCase())),
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    inputRef.current?.focus()
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/"
  }

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: isWide ? 1400 : 900,
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: isWide ? "32px 48px" : "16px 8px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            margin: isWide ? "0 0 18px 0" : "0 0 10px 0",
            padding: isWide ? "24px 24px 18px 24px" : "15px 10px 12px 10px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            minHeight: 48,
            display: "flex",
            flexDirection: isWide ? "row" : "column",
            alignItems: isWide ? "center" : "flex-start",
            justifyContent: "space-between",
            gap: isWide ? 32 : 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="greeting">
              <h1 style={{ fontSize: isWide ? 28 : 22, fontWeight: 600, color: "#222", margin: 0 }}>Food Stalls</h1>
              <p style={{ fontSize: isWide ? 18 : 15, color: "#555", margin: 0 }}>Discover all available food stalls</p>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                marginTop: 15,
                borderRadius: 8,
                overflow: "hidden",
                background: "#f7f7f7",
                border: "1px solid #e0e0e0",
              }}
            >
              <input
                ref={inputRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for food stalls..."
                style={{
                  flexGrow: 1,
                  border: "none",
                  padding: "12px 15px",
                  fontSize: isWide ? 18 : 15,
                  outline: "none",
                  background: "transparent",
                  color: "#222",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#E2B24A",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  fontSize: isWide ? 18 : 15,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div style={{ position: "relative" }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    background: "#f7f7f7",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                  }}
                >
                  <img
                    src="/img/profile.jpg"
                    alt="Profile"
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span style={{ fontSize: isWide ? 16 : 14, color: "#222", fontWeight: 500 }}>
                    {profile ? `${profile.first_name || profile.username}` : user.email}
                  </span>
                  <i className="fas fa-chevron-down" style={{ fontSize: 12, color: "#666" }}></i>
                </button>
                {showUserMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "#fff",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      padding: "8px 0",
                      minWidth: 160,
                      zIndex: 1001,
                      marginTop: 4,
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        color: "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/sign-in" legacyBehavior>
                <a
                  style={{
                    background: "#E2B24A",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: isWide ? 16 : 14,
                  }}
                >
                  Sign In
                </a>
              </Link>
            )}
          </div>
        </div>

        {/* Stalls Grid */}
        <div style={{ marginBottom: isWide ? 24 : 16 }}>
          <h2 style={{ fontSize: isWide ? 22 : 18, fontWeight: 600, color: "#222", marginBottom: isWide ? 16 : 12 }}>
            All Food Stalls ({filteredStalls.length})
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isWide
                ? "repeat(auto-fill, minmax(320px, 1fr))"
                : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: isWide ? 20 : 16,
            }}
          >
            {filteredStalls.map((stall) => (
              <div
                key={stall.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ width: "100%", paddingTop: "60%", position: "relative", background: "#f0f0f0" }}>
                  <img
                    src={stall.image_url || "/img/restaurant-placeholder.jpg"}
                    alt={stall.stall_name}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {stall.status && (
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: stall.status === "open" ? "#22c55e" : "#ef4444",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {stall.status}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    padding: isWide ? "20px" : "16px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: isWide ? 20 : 18, fontWeight: 600, marginBottom: 8, color: "#222" }}>
                      {stall.stall_name}
                    </h3>
                    <p style={{ fontSize: isWide ? 15 : 14, color: "#666", margin: 0, lineHeight: 1.5 }}>
                      {stall.description || "Delicious food awaits you at this amazing stall!"}
                    </p>
                  </div>
                  <div
                    style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <button
                      style={{
                        background: "#E2B24A",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#d4a043")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#E2B24A")}
                    >
                      View Menu
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#666", fontSize: 14 }}>
                      <i className="fas fa-star" style={{ color: "#fbbf24" }}></i>
                      <span>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "10px 0",
            backgroundColor: "#fff",
            borderTop: "1px solid #e0e0e0",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: isWide ? 1400 : 900,
            margin: "0 auto",
            zIndex: 1000,
          }}
        >
          <Link href="/home" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-home"></i>
              </div>
              <span>Home</span>
            </a>
          </Link>
          <Link href="/cart" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-shopping-cart"></i>
              </div>
              <span>Cart</span>
            </a>
          </Link>
          <Link href="/shops-list" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#E2B24A",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem", color: "#E2B24A" }}>
                <i className="fas fa-store"></i>
              </div>
              <span>Shops</span>
            </a>
          </Link>
          <Link href="/favorites" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-heart"></i>
              </div>
              <span>Favorites</span>
            </a>
          </Link>
          <Link href="/notifications" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-bell"></i>
              </div>
              <span>Notifications</span>
            </a>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default ShopsList
