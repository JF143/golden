"use client"

import { useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"

const GOLD = "#E2B24A"
const LIGHT_GOLD = "#fff7e0"
const mockStats = [
  { label: "Total Sales", value: "₱37,800.00", icon: "fa-coins" },
  { label: "Total Revenue", value: "₱37,800.00", icon: "fa-wallet" },
  { label: "Completed Orders", value: 12, icon: "fa-check-circle" },
  { label: "Items Sold", value: 45, icon: "fa-utensils" },
]
const mockTopItems = [
  { name: "Chicken Adobo", sold: 20 },
  { name: "Leche Flan", sold: 15 },
  { name: "Pancit", sold: 10 },
]
const mockRecentOrders = [
  { id: 201, time: "Today 10:30 AM", total: 250 },
  { id: 202, time: "Today 11:00 AM", total: 180 },
  { id: 203, time: "Yesterday", total: 320 },
]

const Overview = () => {
  const router = useRouter()
  const [timeFilter, setTimeFilter] = useState("This Week")
  const timeOptions = ["Today", "This Week", "This Month", "This Year"]

  return (
    <>
      <Head>
        <title>Overview - Golden Bites</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div
        className="app-container"
        style={{
          width: "100vw",
          margin: 0,
          background: "#f7f9fb",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        }}
      >
        <div
          className="main-content"
          style={{
            flexGrow: 1,
            padding: "40px 0 120px 0",
            overflowY: "auto",
            width: "100vw",
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          <div
            className="overview-title-bar"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}
          >
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#000000" }}>Overview</h1>
            <button
              className="refresh-button"
              style={{
                background: GOLD,
                color: "#fff",
                border: "none",
                padding: "8px 15px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <i className="fa-solid fa-rotate"></i>Refresh
            </button>
          </div>
          <div
            className="time-filter"
            style={{ display: "flex", gap: 8, marginBottom: 25, overflowX: "auto", paddingBottom: 5 }}
          >
            {timeOptions.map((opt) => (
              <div
                key={opt}
                className={`time-option${timeFilter === opt ? " active" : ""}`}
                style={{
                  padding: "7px 14px",
                  fontSize: 13,
                  color: timeFilter === opt ? "#fff" : GOLD,
                  background: timeFilter === opt ? GOLD : LIGHT_GOLD,
                  border: timeFilter === opt ? `1px solid ${GOLD}` : "1px solid transparent",
                  borderRadius: 18,
                  cursor: "pointer",
                  fontWeight: timeFilter === opt ? 600 : 400,
                  whiteSpace: "nowrap",
                  marginRight: 0,
                }}
                onClick={() => setTimeFilter(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
              margin: "0 24px 32px 24px",
            }}
          >
            {mockStats.map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  padding: "28px 22px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 26,
                      color: GOLD,
                      background: LIGHT_GOLD,
                      borderRadius: 8,
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 14,
                    }}
                  >
                    <i className={`fa-solid ${stat.icon}`}></i>
                  </div>
                  <span style={{ fontSize: 17, color: "#888", fontWeight: 500 }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#222", letterSpacing: 0.5 }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "#ececec", margin: "0 24px 24px 24px", borderRadius: 1 }} />
          <div style={{ display: "flex", flexDirection: "row", gap: 24, margin: "0 24px", flexWrap: "wrap" }}>
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: "28px 22px",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
                <i className="fa-solid fa-crown" style={{ color: GOLD, fontSize: 22, marginRight: 12 }}></i>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#222", margin: 0 }}>Top Items</h1>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {mockTopItems.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 17,
                      color: "#222",
                      marginBottom: 12,
                      fontWeight: 500,
                      borderRadius: 8,
                      padding: "10px 12px",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f7f7fa")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ marginRight: 10 }}>{item.name}</span>
                    <span style={{ color: "#aaa", fontSize: 15 }}>(Sold: {item.sold})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 320,
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                padding: "28px 22px",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
                <i
                  className="fa-solid fa-clock-rotate-left"
                  style={{ color: "#4a90e2", fontSize: 22, marginRight: 12 }}
                ></i>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#222", margin: 0 }}>Recent Orders</h1>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {mockRecentOrders.map((order, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 17,
                      color: "#222",
                      marginBottom: 12,
                      fontWeight: 500,
                      borderRadius: 8,
                      padding: "10px 12px",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#f7f7fa")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    Order #{order.id} - {order.time} - <span style={{ color: GOLD }}>₱{order.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div
          className="nav-bar"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            background: "#fff",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100vw",
            margin: 0,
            padding: "12px 0",
            zIndex: 1000,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <a
            href="/dashboard"
            className="nav-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 13,
              color: "#777",
              cursor: "pointer",
              padding: "5px 8px",
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault()
              router.push("/dashboard")
            }}
          >
            <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}>
              <i className="fa-solid fa-house"></i>
            </div>
            <div>Home</div>
          </a>
          <a
            href="/orders"
            className="nav-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 13,
              color: "#777",
              cursor: "pointer",
              padding: "5px 8px",
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault()
              router.push("/orders")
            }}
          >
            <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}>
              <i className="fa-solid fa-table-list"></i>
            </div>
            <div>Orders</div>
          </a>
          <div
            className="add-button-container"
            style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <a
              href="/add-item"
              className="add-button"
              style={{
                width: 56,
                height: 56,
                background: "#E2B24A",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                marginTop: -24,
                fontSize: 26,
                color: "#fff",
                cursor: "pointer",
                border: "2px solid #fff",
                zIndex: 1,
              }}
              onClick={(e) => {
                e.preventDefault()
                router.push("/add-item")
              }}
            >
              <i className="fa-solid fa-plus"></i>
            </a>
          </div>
          <a
            href="/food_list"
            className="nav-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 13,
              color: "#777",
              cursor: "pointer",
              padding: "5px 8px",
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault()
              router.push("/food_list")
            }}
          >
            <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}>
              <i className="fa-solid fa-utensils"></i>
            </div>
            <div>Menu</div>
          </a>
          <a
            href="/overview"
            className="nav-item active"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 13,
              color: "#E2B24A",
              cursor: "pointer",
              padding: "5px 8px",
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault()
              router.push("/overview")
            }}
          >
            <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}>
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <div>Sales</div>
          </a>
        </div>
      </div>
    </>
  )
}

export default Overview
