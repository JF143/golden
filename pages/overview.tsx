"use client"

import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

const GOLD = "#E2B24A"
const LIGHT_GOLD = "#fff7e0"
const DARK_GOLD = "#d4a043"

const mockStats = [
  { label: "Total Sales", value: "₱37,800.00", change: "+25%", icon: "fa-coins", trend: "up" },
  { label: "Total Revenue", value: "₱37,800.00", change: "+18%", icon: "fa-wallet", trend: "up" },
  { label: "Completed Orders", value: 142, change: "+12%", icon: "fa-check-circle", trend: "up" },
  { label: "Items Sold", value: 456, change: "+8%", icon: "fa-utensils", trend: "up" },
  { label: "Average Order", value: "₱266", change: "+5%", icon: "fa-receipt", trend: "up" },
  { label: "Customer Rating", value: "4.8", change: "+0.2", icon: "fa-star", trend: "up" },
]

const mockTopItems = [
  { name: "Chicken Adobo", sold: 45, revenue: "₱8,100", percentage: 85 },
  { name: "Leche Flan", sold: 38, revenue: "₱3,040", percentage: 72 },
  { name: "Pancit Canton", sold: 32, revenue: "₱3,840", percentage: 60 },
  { name: "Halo-Halo", sold: 28, revenue: "₱4,200", percentage: 53 },
  { name: "Lumpia", sold: 25, revenue: "₱1,250", percentage: 47 },
]

const mockRecentOrders = [
  { id: 201, customer: "John D.", time: "Today 10:30 AM", total: 250, status: "Completed" },
  { id: 202, customer: "Maria S.", time: "Today 11:00 AM", total: 180, status: "Completed" },
  { id: 203, customer: "Carlos R.", time: "Today 11:30 AM", total: 320, status: "Completed" },
  { id: 204, customer: "Ana G.", time: "Today 12:00 PM", total: 150, status: "Completed" },
]

const mockSalesData = [
  { period: "Mon", sales: 2400 },
  { period: "Tue", sales: 3200 },
  { period: "Wed", sales: 2800 },
  { period: "Thu", sales: 3600 },
  { period: "Fri", sales: 4200 },
  { period: "Sat", sales: 3800 },
  { period: "Sun", sales: 3400 },
]

const Overview = () => {
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState("This Week")
  const timeOptions = ["Today", "This Week", "This Month", "This Year"]

  const maxSales = Math.max(...mockSalesData.map((d) => d.sales))

  return (
    <>
      <Head>
        <title>Sales Overview - Golden Bites</title>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 4 }}>Sales Overview 📊</h1>
                <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
                  Track your restaurant's performance and analytics
                </p>
              </div>
              <button
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              >
                <i className="fa-solid fa-download"></i>
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px", paddingBottom: 120 }}>
          {/* Time Filter */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "16px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                display: "flex",
                gap: 8,
                overflowX: "auto",
              }}
            >
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeFilter(option)}
                  style={{
                    background: timeFilter === option ? GOLD : "transparent",
                    color: timeFilter === option ? "#fff" : "#666",
                    border: timeFilter === option ? `2px solid ${GOLD}` : "2px solid transparent",
                    borderRadius: 12,
                    padding: "8px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (timeFilter !== option) {
                      e.currentTarget.style.background = LIGHT_GOLD
                      e.currentTarget.style.color = GOLD
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (timeFilter !== option) {
                      e.currentTarget.style.background = "transparent"
                      e.currentTarget.style.color = "#666"
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

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
                  border: "1px solid #f0f0f0",
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
                      background: `linear-gradient(135deg, ${GOLD}20, ${GOLD}10)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `2px solid ${GOLD}30`,
                    }}
                  >
                    <i className={`fa-solid ${stat.icon}`} style={{ fontSize: 24, color: GOLD }}></i>
                  </div>
                  <div
                    style={{
                      background: stat.trend === "up" ? "#e8f5e8" : "#ffeaea",
                      color: stat.trend === "up" ? "#2e7d32" : "#d32f2f",
                      padding: "6px 12px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <i className={`fa-solid ${stat.trend === "up" ? "fa-arrow-up" : "fa-arrow-down"}`}></i>
                    {stat.change}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 8, fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#222" }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Charts and Analytics */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32, marginBottom: 32 }}>
            {/* Sales Chart */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                <i className="fa-solid fa-chart-line" style={{ color: GOLD, fontSize: 20, marginRight: 12 }}></i>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#222", margin: 0 }}>Weekly Sales</h3>
              </div>

              <div style={{ height: 200, display: "flex", alignItems: "end", gap: 12, padding: "0 8px" }}>
                {mockSalesData.map((data, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "100%",
                        height: (data.sales / maxSales) * 160,
                        background: `linear-gradient(to top, ${GOLD}, ${LIGHT_GOLD})`,
                        borderRadius: "4px 4px 0 0",
                        marginBottom: 8,
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = `linear-gradient(to top, ${DARK_GOLD}, ${GOLD})`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = `linear-gradient(to top, ${GOLD}, ${LIGHT_GOLD})`)
                      }
                      title={`₱${data.sales.toLocaleString()}`}
                    ></div>
                    <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{data.period}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Items */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <i className="fa-solid fa-crown" style={{ color: GOLD, fontSize: 20, marginRight: 12 }}></i>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#222", margin: 0 }}>Top Items</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {mockTopItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>{item.name}</span>
                      <span style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>{item.revenue}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          flex: 1,
                          height: 6,
                          background: "#f0f0f0",
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${item.percentage}%`,
                            height: "100%",
                            background: `linear-gradient(to right, ${GOLD}, ${DARK_GOLD})`,
                            borderRadius: 3,
                            transition: "width 0.3s ease",
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: 12, color: "#666", minWidth: 40 }}>{item.sold} sold</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              border: "1px solid #f0f0f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <i
                  className="fa-solid fa-clock-rotate-left"
                  style={{ color: "#4a90e2", fontSize: 20, marginRight: 12 }}
                ></i>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#222", margin: 0 }}>Recent Orders</h3>
              </div>
              <button
                onClick={() => router.push("/orders")}
                style={{
                  background: "transparent",
                  color: GOLD,
                  border: `1px solid ${GOLD}`,
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
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
                View All
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mockRecentOrders.map((order, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "#f8f9fa",
                    borderRadius: 12,
                    transition: "background 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = LIGHT_GOLD)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f8f9fa")}
                >
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#222", marginBottom: 4 }}>
                      Order #{order.id} - {order.customer}
                    </div>
                    <div style={{ fontSize: 14, color: "#666" }}>{order.time}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: GOLD }}>₱{order.total}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#28a745",
                        background: "#d4edda",
                        padding: "2px 8px",
                        borderRadius: 12,
                        marginTop: 4,
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
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
            <i className="fa-solid fa-chart-simple" style={{ fontSize: 20, marginBottom: 4, color: GOLD }}></i>
            Sales
          </a>
        </div>
      </div>
    </>
  )
}

export default Overview
