"use client"

import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

const GOLD = "#E2B24A"
const LIGHT_GOLD = "#fff7e0"
const DARK_GOLD = "#d4a043"

const mockOrders = [
  {
    id: 101,
    customer: "Rapahel Abad",
    items: ["Chicken Adobo"],
    total: 250,
    status: "Pending",
    time: "10:30 AM",
    phone: "+63 912 345 6789",
    address: "St. Cruz",
  },
  {
    id: 102,
    customer: "Maria Santos",
    items: ["Leche Flan", "Coffee"],
    total: 180,
    status: "Preparing",
    time: "11:00 AM",
    phone: "+63 917 234 5678",
    address: "Phelan Building",
  },
  {
    id: 103,
    customer: "Carlos Rivera",
    items: ["Pancit Canton", "Lumpia (5pcs)", "Soda"],
    total: 320,
    status: "Ready",
    time: "11:15 AM",
    phone: "+63 905 123 4567",
    address: "Library",
  },
  {
    id: 104,
    customer: "Ana Garcia",
    items: ["Halo-Halo"],
    total: 150,
    status: "Completed",
    time: "Yesterday",
    phone: "+63 918 765 4321",
    address: "Bonoan",
  },
  {
    id: 105,
    customer: "Gian Chaves",
    items: ["Chicken Curry", "Rice"],
    total: 200,
    status: "Cancelled",
    time: "Yesterday",
    phone: "+63 920 987 6543",
    address: "Alingal Bldg. 211A",
  },
]

type StatusKey = "Pending" | "Preparing" | "Ready" | "Completed" | "Cancelled"

const statusConfig: Record<StatusKey, { bg: string; color: string; icon: string; action?: string }> = {
  Pending: { bg: "#fff3cd", color: "#856404", icon: "fa-clock", action: "Start Preparing" },
  Preparing: { bg: "#d1ecf1", color: "#0c5460", icon: "fa-fire", action: "Mark Ready" },
  Ready: { bg: "#d4edda", color: "#155724", icon: "fa-check-circle", action: "Mark Completed" },
  Completed: { bg: "#f8f9fa", color: "#6c757d", icon: "fa-check-double" },
  Cancelled: { bg: "#f8d7da", color: "#721c24", icon: "fa-times-circle" },
}

const Orders = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<StatusKey>("Pending")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const tabs: StatusKey[] = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"]

  const updateOrderStatus = (orderId: number, newStatus: StatusKey) => {
    console.log(`Update order ${orderId} to ${newStatus}`)
    // In a real app, this would update the backend
  }

  const getNextStatus = (currentStatus: StatusKey): StatusKey | null => {
    const statusFlow: Record<StatusKey, StatusKey | null> = {
      Pending: "Preparing",
      Preparing: "Ready",
      Ready: "Completed",
      Completed: null,
      Cancelled: null,
    }
    return statusFlow[currentStatus]
  }

  const filteredOrders = mockOrders.filter((order) => order.status === activeTab)

  return (
    <>
      <Head>
        <title>Orders - Golden Bites Merchant</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div
        style={{
          width: "100vw",
          margin: 0,
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          minHeight: "100vh",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, ${DARK_GOLD} 100%)`,
            padding: "24px 32px",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(226, 178, 74, 0.3)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 4 }}>Order Management</h1>
                <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>Track and manage all your restaurant orders</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    {mockOrders.filter((o) => o.status === "Pending").length}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Pending</div>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    {mockOrders.filter((o) => o.status === "Preparing").length}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Preparing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px", paddingBottom: 120 }}>
          {/* Status Tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 32,
              overflowX: "auto",
              paddingBottom: 8,
              background: "#fff",
              borderRadius: 16,
              padding: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? GOLD : "transparent",
                  color: activeTab === tab ? "#fff" : "#666",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {tab}
                <span
                  style={{
                    background: activeTab === tab ? "rgba(255,255,255,0.3)" : LIGHT_GOLD,
                    color: activeTab === tab ? "#fff" : GOLD,
                    borderRadius: 12,
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {mockOrders.filter((o) => o.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredOrders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                }}
              >
                <i
                  className={`fa-solid ${statusConfig[activeTab].icon}`}
                  style={{ fontSize: 64, color: "#e0e0e0", marginBottom: 16 }}
                ></i>
                <h3 style={{ fontSize: 20, color: "#666", marginBottom: 8 }}>No {activeTab.toLowerCase()} orders</h3>
                <p style={{ color: "#999" }}>Orders will appear here when customers place them</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const config = statusConfig[order.status as StatusKey]
                const nextStatus = getNextStatus(order.status as StatusKey)

                return (
                  <div
                    key={order.id}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "24px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      border: "1px solid #f0f0f0",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          <span style={{ fontSize: 20, fontWeight: 700, color: "#222" }}>Order #{order.id}</span>
                          <span
                            style={{
                              background: config.bg,
                              color: config.color,
                              padding: "6px 12px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <i className={`fa-solid ${config.icon}`}></i>
                            {order.status}
                          </span>
                          <span style={{ fontSize: 14, color: "#888" }}>{order.time}</span>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: 16,
                            marginBottom: 16,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>Customer</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: "#222" }}>{order.customer}</div>
                            <div style={{ fontSize: 14, color: "#888" }}>{order.phone}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>Delivery Address</div>
                            <div style={{ fontSize: 14, color: "#222" }}>{order.address}</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <div style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>Items Ordered</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {order.items.map((item, index) => (
                              <span
                                key={index}
                                style={{
                                  background: LIGHT_GOLD,
                                  color: DARK_GOLD,
                                  padding: "4px 12px",
                                  borderRadius: 16,
                                  fontSize: 12,
                                  fontWeight: 500,
                                }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", marginLeft: 24 }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: GOLD, marginBottom: 16 }}>
                          ₱{order.total}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {nextStatus && (
                            <button
                              onClick={() => updateOrderStatus(order.id, nextStatus)}
                              style={{
                                background: GOLD,
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 16px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                                whiteSpace: "nowrap",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = DARK_GOLD)}
                              onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
                            >
                              {config.action}
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              background: "transparent",
                              color: "#666",
                              border: "1px solid #e0e0e0",
                              borderRadius: 8,
                              padding: "8px 16px",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = GOLD
                              e.currentTarget.style.color = GOLD
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#e0e0e0"
                              e.currentTarget.style.color = "#666"
                            }}
                          >
                            View Details
                          </button>

                          {order.status === "Pending" && (
                            <button
                              onClick={() => updateOrderStatus(order.id, "Cancelled")}
                              style={{
                                background: "#dc3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "8px 16px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s ease",
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
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
            onClick={(e) => {
              e.preventDefault()
              router.push("/dashboard")
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
            <i className="fa-solid fa-house" style={{ fontSize: 20, marginBottom: 4 }}></i>
            Home
          </a>
          <a
            href="/orders"
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
            <i className="fa-solid fa-table-list" style={{ fontSize: 20, marginBottom: 4, color: GOLD }}></i>
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

export default Orders
