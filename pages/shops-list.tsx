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
  const [shops, setShops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const isWide = useResponsive()
  const { user, profile } = useUser()

  useEffect(() => {
    const fetchShops = async () => {
      try {
        // Only fetch shops owned by the current user if they're a merchant
        let query = supabase.from("food_stall").select("*")

        if (user && profile?.user_type === "merchant") {
          query = query.eq("owner_id", user.id)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching shops:", error)
        } else {
          setShops(data || [])
        }
      } catch (error) {
        console.error("Error in fetchShops:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchShops()
    } else {
      setLoading(false)
    }
  }, [user, profile])

  const filteredShops = shops.filter(
    (shop) =>
      shop.stall_name.toLowerCase().includes(search.toLowerCase()) ||
      (shop.description && shop.description.toLowerCase().includes(search.toLowerCase())),
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f7f7",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, color: "#666" }}>Loading your shops...</div>
        </div>
      </div>
    )
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
            margin: isWide ? "0 0 24px 0" : "0 0 16px 0",
            padding: isWide ? "24px" : "16px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h1 style={{ fontSize: isWide ? 28 : 22, fontWeight: 600, color: "#222", margin: 0 }}>My Shops</h1>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/dashboard" legacyBehavior>
                <a
                  style={{
                    background: "#E2B24A",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  Dashboard
                </a>
              </Link>
              <button
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + Add Shop
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              borderRadius: 8,
              overflow: "hidden",
              background: "#f7f7f7",
              border: "1px solid #e0e0e0",
            }}
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your shops..."
              style={{
                flexGrow: 1,
                border: "none",
                padding: "12px 15px",
                fontSize: isWide ? 16 : 14,
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
                fontSize: isWide ? 16 : 14,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>

        {/* Shops Grid */}
        <div style={{ marginBottom: isWide ? 80 : 60 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isWide
                ? "repeat(auto-fill, minmax(320px, 1fr))"
                : "repeat(auto-fill, minmax(280px, 1fr))",
              gap: isWide ? 24 : 16,
            }}
          >
            {filteredShops.map((shop) => (
              <div
                key={shop.id}
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
                    src={shop.image_url || "/img/shop-placeholder.jpg"}
                    alt={shop.stall_name}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
                    <h3
                      style={{
                        fontSize: isWide ? 20 : 18,
                        fontWeight: 600,
                        marginBottom: 8,
                        color: "#222",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {shop.stall_name}
                    </h3>
                    {shop.description && (
                      <p
                        style={{
                          fontSize: isWide ? 14 : 13,
                          color: "#666",
                          marginBottom: 12,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {shop.description}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: isWide ? 12 : 11,
                        color: "#888",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <i className="fas fa-store" style={{ fontSize: 10 }}></i>
                      My Shop
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          background: "#E2B24A",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Manage
                      </button>
                      <button
                        style={{
                          background: "#6c757d",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 12px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredShops.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
              <h3 style={{ fontSize: 20, color: "#222", marginBottom: 8 }}>No shops found</h3>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
                {search ? `No shops match "${search}"` : "You haven't created any shops yet"}
              </p>
              {!search && (
                <button
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create Your First Shop
                </button>
              )}
            </div>
          )}
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
