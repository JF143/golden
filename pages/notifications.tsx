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

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const isWide = useResponsive()
  const { user, profile } = useUser()

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching notifications:", error)
        } else {
          setNotifications(data || [])
        }
      } catch (error) {
        console.error("Error in fetchNotifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (!error) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
        )
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      if (!error) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
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
          <div style={{ fontSize: 18, color: "#666" }}>Loading notifications...</div>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

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
            <div>
              <h1 style={{ fontSize: isWide ? 28 : 22, fontWeight: 600, color: "#222", margin: 0 }}>Notifications</h1>
              {unreadCount > 0 && (
                <p style={{ fontSize: 14, color: "#666", margin: "4px 0 0 0" }}>
                  You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/home" legacyBehavior>
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
                  ← Back to Home
                </a>
              </Link>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
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
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ marginBottom: isWide ? 80 : 60 }}>
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
              <h3 style={{ fontSize: 20, color: "#222", marginBottom: 8 }}>No notifications yet</h3>
              <p style={{ color: "#666", fontSize: 14 }}>You'll see notifications about your orders and account here</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: isWide ? "20px" : "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    border: notification.is_read ? "1px solid #e0e0e0" : "2px solid #E2B24A",
                    cursor: notification.is_read ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  {!notification.is_read && (
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#E2B24A",
                      }}
                    />
                  )}

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: notification.is_read ? "#f0f0f0" : "#fff3e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className={`fas ${getNotificationIcon(notification.type)}`}
                        style={{
                          color: notification.is_read ? "#999" : "#E2B24A",
                          fontSize: 16,
                        }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: isWide ? 16 : 15,
                          fontWeight: 600,
                          color: notification.is_read ? "#666" : "#222",
                          marginBottom: 4,
                        }}
                      >
                        {notification.title}
                      </h4>
                      <p
                        style={{
                          fontSize: isWide ? 14 : 13,
                          color: notification.is_read ? "#999" : "#555",
                          marginBottom: 8,
                          lineHeight: 1.4,
                        }}
                      >
                        {notification.message}
                      </p>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#aaa",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span>{formatDate(notification.created_at)}</span>
                        {!notification.is_read && (
                          <span
                            style={{
                              background: "#E2B24A",
                              color: "#fff",
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

// Helper function to get notification icon based on type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "order":
      return "fa-shopping-bag"
    case "payment":
      return "fa-credit-card"
    case "delivery":
      return "fa-truck"
    case "promotion":
      return "fa-tag"
    case "account":
      return "fa-user"
    default:
      return "fa-bell"
  }
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString()
  }
}

export default Notifications
