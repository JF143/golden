"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
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

const Notifications = () => {
  const isWide = useResponsive()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const { user, profile, loading: userLoading, signOut } = useUser()

  useEffect(() => {
    // Mock notifications data - replace with actual Supabase query
    const mockNotifications = [
      {
        id: 1,
        title: "Order Confirmed",
        message: "Your order from Mama's Kitchen has been confirmed!",
        time: "2 minutes ago",
        read: false,
        type: "order",
      },
      {
        id: 2,
        title: "Delivery Update",
        message: "Your food is on the way! Expected delivery in 15 minutes.",
        time: "10 minutes ago",
        read: false,
        type: "delivery",
      },
      {
        id: 3,
        title: "New Restaurant",
        message: "Pizza Palace just joined Golden Bites! Check out their menu.",
        time: "1 hour ago",
        read: true,
        type: "promo",
      },
      {
        id: 4,
        title: "Order Delivered",
        message: "Your order has been delivered successfully. Enjoy your meal!",
        time: "2 hours ago",
        read: true,
        type: "order",
      },
    ]
    setNotifications(mockNotifications)
  }, [])

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/"
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "🍽️"
      case "delivery":
        return "🚚"
      case "promo":
        return "🎉"
      default:
        return "📢"
    }
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
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
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/home" legacyBehavior>
              <a style={{ color: "#E2B24A", fontSize: 20, textDecoration: "none" }}>
                <i className="fas fa-arrow-left"></i>
              </a>
            </Link>
            <div>
              <h1 style={{ fontSize: isWide ? 28 : 22, fontWeight: 600, color: "#222", margin: 0 }}>Notifications</h1>
              <p style={{ fontSize: isWide ? 18 : 15, color: "#555", margin: 0 }}>
                Stay updated with your orders and offers
              </p>
            </div>
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

        {/* Notifications List */}
        <div style={{ marginBottom: isWide ? 24 : 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: isWide ? 20 : 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: `1px solid ${notification.read ? "#e0e0e0" : "#E2B24A"}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >
                {!notification.read && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 8,
                      height: 8,
                      background: "#E2B24A",
                      borderRadius: "50%",
                    }}
                  ></div>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div
                    style={{
                      fontSize: 24,
                      minWidth: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f0f0f0",
                      borderRadius: "50%",
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: isWide ? 18 : 16,
                        fontWeight: 600,
                        color: "#222",
                        marginBottom: 4,
                        opacity: notification.read ? 0.7 : 1,
                      }}
                    >
                      {notification.title}
                    </h3>
                    <p
                      style={{
                        fontSize: isWide ? 15 : 14,
                        color: "#666",
                        margin: 0,
                        marginBottom: 8,
                        lineHeight: 1.5,
                        opacity: notification.read ? 0.7 : 1,
                      }}
                    >
                      {notification.message}
                    </p>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#999",
                        opacity: notification.read ? 0.7 : 1,
                      }}
                    >
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 40,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                border: "1px solid #e0e0e0",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: "#222", marginBottom: 8 }}>No notifications yet</h3>
              <p style={{ fontSize: 16, color: "#666", margin: 0 }}>
                We'll notify you when there are updates about your orders
              </p>
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
          <Link href="/shop-products" legacyBehavior>
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
                color: "#E2B24A",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem", color: "#E2B24A" }}>
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

export default Notifications
