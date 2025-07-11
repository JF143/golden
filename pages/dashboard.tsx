"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useUser } from "../lib/userContext"
import { supabase } from "../lib/supabaseClient"

const GOLD = "#E2B24A"
const LIGHT_GOLD = "#fff7e0"
const DARK_GOLD = "#d4a043"

const mockStats = [
  { label: "Today's Sales", value: "₱2,450", change: "+12%", icon: "fa-coins", color: "#4CAF50" },
  { label: "Pending Orders", value: "8", change: "+3", icon: "fa-clock", color: "#FF9800" },
  { label: "Completed Today", value: "24", change: "+18%", icon: "fa-check-circle", color: "#2196F3" },
  { label: "Total Revenue", value: "₱37,800", change: "+25%", icon: "fa-chart-line", color: "#9C27B0" },
]

const mockRecentOrders = [
  { id: 301, customer: "John D.", items: "Chicken Adobo, Rice", total: 180, status: "Preparing", time: "2 min ago" },
  { id: 302, customer: "Maria S.", items: "Leche Flan, Coffee", total: 120, status: "Ready", time: "5 min ago" },
  { id: 303, customer: "Carlos R.", items: "Pancit, Lumpia", total: 250, status: "Pending", time: "8 min ago" },
]

const mockQuickActions = [
  { label: "Add New Item", icon: "fa-plus", color: GOLD, href: "/add-item" },
  { label: "View All Orders", icon: "fa-list", color: "#2196F3", href: "/orders" },
  { label: "Sales Report", icon: "fa-chart-bar", color: "#4CAF50", href: "/overview" },
  { label: "Menu Management", icon: "fa-utensils", color: "#FF9800", href: "/food_list" },
]

const Dashboard = () => {
  const router = useRouter()
  const { user, profile, signOut } = useUser()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  // Edit Shop Name modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [newShopName, setNewShopName] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [editSuccess, setEditSuccess] = useState("")
  const [currentShopName, setCurrentShopName] = useState("");

  // Fetch current shop name for the logged-in user
  useEffect(() => {
    const fetchShopName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("food_stall")
          .select("stall_name")
          .eq("owner_id", user.id)
          .single();
        if (data && data.stall_name) {
          setCurrentShopName(data.stall_name);
        } else {
          setCurrentShopName("");
        }
      }
    };
    fetchShopName();
  }, [user]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return { bg: "#fff3cd", color: "#856404", border: "#ffeaa7" }
      case "Preparing":
        return { bg: "#d1ecf1", color: "#0c5460", border: "#bee5eb" }
      case "Ready":
        return { bg: "#d4edda", color: "#155724", border: "#c3e6cb" }
      default:
        return { bg: "#f8f9fa", color: "#6c757d", border: "#dee2e6" }
    }
  }

  // Edit Shop Name handler
  const handleEditShopName = async () => {
    setEditLoading(true)
    setEditError("")
    setEditSuccess("")
    if (!newShopName.trim()) {
      setEditError("Shop name cannot be empty.")
      setEditLoading(false)
      return
    }
    if (!user) {
      setEditError("User not found. Please sign in again.");
      setEditLoading(false);
      return;
    }
    // Check if food_stall row exists for this user
    const { data: existingStall, error: fetchError } = await supabase
      .from("food_stall")
      .select("id")
      .eq("owner_id", user.id)
      .single();
    if (fetchError && fetchError.code !== 'PGRST116') { // Not found is ok, other errors are not
      setEditError("Failed to check shop: " + fetchError.message)
      setEditLoading(false)
      return
    }
    let error;
    if (existingStall && existingStall.id) {
      // Update existing
      ({ error } = await supabase
        .from("food_stall")
        .update({ stall_name: newShopName.trim() })
        .eq("owner_id", user.id));
    } else {
      // Insert new
      ({ error } = await supabase
        .from("food_stall")
        .insert([{ owner_id: user.id, stall_name: newShopName.trim(), service_type: "Pickup" }]));
    }
    if (error) {
      setEditError("Failed to update shop name: " + error.message)
    } else {
      setEditSuccess("Shop name updated!")
      setCurrentShopName(newShopName.trim());
      setTimeout(() => {
        setShowEditModal(false)
        setEditSuccess("")
      }, 1000)
    }
    setEditLoading(false)
  }

  return (
    <>
      <Head>
        <title>Dashboard - Golden Bites Merchant</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div
        style={{
          width: "100vw",
          margin: 0,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {/* Edit Shop Name Modal */}
        {showEditModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, boxShadow: "0 4px 16px rgba(0,0,0,0.18)", textAlign: "center" }}>
              <h3 style={{ marginBottom: 18, color: "#222" }}>Edit Shop Name</h3>
              <input
                type="text"
                value={newShopName}
                onChange={e => setNewShopName(e.target.value)}
                placeholder={currentShopName ? `Current: ${currentShopName}` : "Enter new shop name"}
                style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #ddd", fontSize: 16, marginBottom: 16, background: "#fff", color: "#111" }}
                disabled={editLoading}
              />
              {editError && <div style={{ color: "#c33", marginBottom: 10 }}>{editError}</div>}
              {editSuccess && <div style={{ color: "#006421", marginBottom: 10 }}>{editSuccess}</div>}
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  onClick={handleEditShopName}
                  disabled={editLoading}
                  style={{ background: "#E2B24A", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 600, cursor: editLoading ? "not-allowed" : "pointer" }}
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                  style={{ background: "#eee", color: "#333", border: "none", borderRadius: 6, padding: "10px 24px", fontWeight: 600, cursor: editLoading ? "not-allowed" : "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #E2B24A 0%, #d4a043 100%)",
            padding: "24px 32px",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(226, 178, 74, 0.3)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, marginBottom: 4 }}>Welcome back, {profile ? (profile.first_name || profile.username) : 'Chef'}!</h1>
                <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
                  Here's what's happening with your restaurant today
                </p>
              </div>
              <div style={{ textAlign: "right", position: "relative" }}>
                <div style={{ fontSize: 24, fontWeight: 600 }}>{currentTime}</div>
                {user && (
                  <div style={{ position: "absolute", top: 0, right: 0 }}>
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
                        marginTop: 8,
                        marginRight: 0,
                      }}
                    >
                      <img
                        src="/img/profile.jpg"
                        alt="Profile"
                        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span style={{ fontSize: 16, color: "#222", fontWeight: 500 }}>
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
                          onClick={async () => {
                            setShowEditModal(true);
                            setEditError("");
                            setEditSuccess("");
                            // Fetch and set the current shop name and prefill
                            if (user) {
                              const { data, error } = await supabase
                                .from("food_stall")
                                .select("stall_name")
                                .eq("owner_id", user.id)
                                .single();
                              if (data && data.stall_name) {
                                setCurrentShopName(data.stall_name);
                                setNewShopName(data.stall_name);
                              } else {
                                setCurrentShopName("");
                                setNewShopName("");
                              }
                            }
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 14,
                            color: "#222",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontWeight: 600,
                          }}
                        >
                          <i className="fas fa-pen"></i>
                          Edit Shop Name
                        </button>
                        <button
                          onClick={async () => {
                            setShowUserMenu(false)
                            await signOut()
                            window.location.href = "/"
                          }}
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
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px", paddingBottom: 120 }}>
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              marginBottom: 32,
            }}
          >
            {mockStats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "24px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(226, 178, 74, 0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${stat.color}30`,
                    }}
                  >
                    <i className={`fa-solid ${stat.icon}`} style={{ fontSize: 24, color: stat.color }}></i>
                  </div>
                  <div
                    style={{
                      background: stat.change.startsWith("+") ? "#e8f5e8" : "#ffeaea",
                      color: stat.change.startsWith("+") ? "#2e7d32" : "#d32f2f",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {stat.change}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8, fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#222", marginBottom: 20 }}>Quick Actions</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {mockQuickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => router.push(action.href)}
                  style={{
                    background: "#fff",
                    border: `2px solid ${action.color}30`,
                    borderRadius: 12,
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${action.color}10`
                    e.currentTarget.style.borderColor = action.color
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fff"
                    e.currentTarget.style.borderColor = `${action.color}30`
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <i
                    className={`fa-solid ${action.icon}`}
                    style={{ fontSize: 24, color: action.color, marginBottom: 12 }}
                  ></i>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#222" }}>{action.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: "#222", margin: 0 }}>Recent Orders</h2>
              <button
                onClick={() => router.push("/orders")}
                style={{
                  background: GOLD,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = DARK_GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              >
                View All
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mockRecentOrders.map((order) => {
                const statusStyle = getStatusColor(order.status)
                return (
                  <div
                    key={order.id}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "20px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                      border: "1px solid #f0f0f0",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: "#222", marginRight: 12 }}>
                            Order #{order.id}
                          </span>
                          <span
                            style={{
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              border: `1px solid ${statusStyle.border}`,
                              padding: "4px 12px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 16, color: "#666", marginBottom: 4 }}>
                          <strong>Customer:</strong> {order.customer}
                        </div>
                        <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>{order.items}</div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{order.time}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: GOLD }}>₱{order.total}</div>
                        <button
                          style={{
                            background: "transparent",
                            border: `1px solid ${GOLD}`,
                            color: GOLD,
                            borderRadius: 6,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            marginTop: 8,
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = GOLD
                            e.currentTarget.style.color = "#fff"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent"
                            e.currentTarget.style.color = GOLD
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            background: "#fff",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 0",
            zIndex: 1000,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <a
            href="/dashboard"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
              color: GOLD,
              cursor: "pointer",
              padding: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: 20, marginBottom: 4, color: GOLD }}></i>
            Home
          </a>
          <a
            href="/orders"
            onClick={(e) => {
              e.preventDefault()
              router.push("/orders")
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
              color: "#777",
              cursor: "pointer",
              padding: "8px",
              textDecoration: "none",
            }}
          >
            <i className="fa-solid fa-table-list" style={{ fontSize: 20, marginBottom: 4 }}></i>
            Orders
          </a>
          <div style={{ position: "relative" }}>
            <a
              href="/add-item"
              onClick={(e) => {
                e.preventDefault()
                router.push("/add-item")
              }}
              style={{
                width: 56,
                height: 56,
                background: `linear-gradient(135deg, ${GOLD}, ${DARK_GOLD})`,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 16px rgba(226, 178, 74, 0.4)",
                marginTop: -20,
                fontSize: 24,
                color: "#fff",
                cursor: "pointer",
                border: "3px solid #fff",
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <i className="fa-solid fa-plus"></i>
            </a>
          </div>
          <a
            href="/food_list"
            onClick={(e) => {
              e.preventDefault()
              router.push("/food_list")
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
              color: "#777",
              cursor: "pointer",
              padding: "8px",
              textDecoration: "none",
            }}
          >
            <i className="fa-solid fa-utensils" style={{ fontSize: 20, marginBottom: 4 }}></i>
            Menu
          </a>
          <a
            href="/overview"
            onClick={(e) => {
              e.preventDefault()
              router.push("/overview")
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
              color: "#777",
              cursor: "pointer",
              padding: "8px",
              textDecoration: "none",
            }}
          >
            <i className="fa-solid fa-chart-simple" style={{ fontSize: 20, marginBottom: 4 }}></i>
            Sales
          </a>
        </div>
      </div>
    </>
  )
}

export default Dashboard
