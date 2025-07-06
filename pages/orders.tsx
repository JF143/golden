import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const mockOrders = [
  { id: 101, status: "Pending", time: "10:30 AM", total: 250, items: 3 },
  { id: 102, status: "Preparing", time: "11:00 AM", total: 180, items: 2 },
  { id: 103, status: "Ready", time: "11:15 AM", total: 320, items: 4 },
  { id: 104, status: "Completed", time: "Yesterday", total: 150, items: 1 },
  { id: 105, status: "Cancelled", time: "Yesterday", total: 200, items: 2 },
];

type StatusKey = "Pending" | "Preparing" | "Ready" | "Completed" | "Cancelled";
const statusColors: Record<StatusKey, { bg: string; color: string }> = {
  Pending: { bg: "#fff8e1", color: "#f57c00" },
  Preparing: { bg: "#e3f2fd", color: "#1976d2" },
  Ready: { bg: "#e8f5e9", color: "#388e3c" },
  Completed: { bg: "#f5f5f5", color: "#616161" },
  Cancelled: { bg: "#ffebee", color: "#d32f2f" },
};

const Orders = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StatusKey>("Pending");
  const tabs: StatusKey[] = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];

  return (
    <>
      <Head>
        <title>Orders - Golden Bites</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div className="container" style={{ width: "100vw", margin: 0, background: "#f7f9fb", minHeight: "100vh", borderRadius: 0, position: "relative", padding: "1rem 0 0 0" }}>
        {/* Aesthetic Orders Header */}
        <div style={{ width: '100%', maxWidth: 900, margin: '48px auto 0 auto', padding: '0 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'transparent' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#222', marginBottom: 6, letterSpacing: 0.5, fontFamily: "'League Spartan', 'Glacial Indifference', 'Inter', sans-serif" }}>Orders</div>
          <div style={{ fontSize: 16, color: '#888', fontWeight: 400, marginBottom: 18 }}>Manage and track your orders</div>
        </div>
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 18px auto', height: 12, background: 'linear-gradient(180deg, #fff 60%, #ececec 100%)', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }} />
        <div className="order-tabs" style={{ display: "flex", overflowX: "auto", gap: 10, margin: "0 32px 20px", paddingBottom: 5 }}>
          {tabs.map(tab => (
            <div
              key={tab}
              className={`order-tab${activeTab === tab ? " active" : ""}`}
              style={{
                padding: "8px 15px",
                fontSize: 14,
                color: activeTab === tab ? "#0047ab" : "#111",
                cursor: "pointer",
                borderBottom: activeTab === tab ? "2px solid #0047ab" : "2px solid transparent",
                fontWeight: activeTab === tab ? 500 : 400,
                whiteSpace: "nowrap",
                position: "relative",
                transition: "color 0.2s, border-bottom-color 0.2s"
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="count-badge" style={{ display: "inline-block", background: "#0047ab", color: "#fff", fontSize: 12, padding: "2px 6px", borderRadius: 10, marginLeft: 5 }}>{mockOrders.filter(o => o.status === tab).length}</span>
            </div>
          ))}
        </div>
        <div className="orders-list" style={{ display: "flex", flexDirection: "column", gap: 15, padding: "0 32px 70px" }}>
          {mockOrders.filter(o => o.status === activeTab).map(order => (
            <div className="order-item" key={order.id} style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 15 }}>
              <div className="order-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span className="order-id" style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>Order #{order.id}</span>
                <span className={`order-status status-${order.status.toLowerCase()}`} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 4, background: statusColors[order.status as StatusKey].bg, color: statusColors[order.status as StatusKey].color }}>{order.status}</span>
              </div>
              <div style={{ fontSize: 14, color: "#111" }}>Time: {order.time}</div>
              <div style={{ fontSize: 14, color: "#111" }}>Items: {order.items}</div>
              <div style={{ fontSize: 14, color: "#111" }}>Total: ₱{order.total}</div>
            </div>
          ))}
          {mockOrders.filter(o => o.status === activeTab).length === 0 && (
            <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No orders in this category.</div>
          )}
        </div>
      </div>
      <div className="nav-bar" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", background: "#fff", boxShadow: "0 -2px 10px rgba(0,0,0,0.1)", position: "fixed", bottom: 0, left: 0, right: 0, width: "100vw", margin: 0, padding: "12px 0", zIndex: 1000, borderTop: "1px solid #e0e0e0" }}>
        <a href="/dashboard" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#777", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/dashboard'); }}>
          <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}><i className="fa-solid fa-house"></i></div>
          <div>Home</div>
        </a>
        <a href="/orders" className="nav-item active" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#E2B24A", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/orders'); }}>
          <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}><i className="fa-solid fa-table-list"></i></div>
          <div>Orders</div>
        </a>
        <div className="add-button-container" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <a href="/add-item" className="add-button" style={{ width: 56, height: 56, background: "#E2B24A", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", marginTop: -24, fontSize: 26, color: "#fff", cursor: "pointer", border: "2px solid #fff", zIndex: 1 }} onClick={e => { e.preventDefault(); router.push('/add-item'); }}>
            <i className="fa-solid fa-plus"></i>
          </a>
        </div>
        <a href="/food_list" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#777", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/food_list'); }}>
          <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}><i className="fa-solid fa-utensils"></i></div>
          <div>Menu</div>
        </a>
        <a href="/overview" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#777", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/overview'); }}>
          <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}><i className="fa-solid fa-chart-simple"></i></div>
          <div>Sales</div>
        </a>
      </div>
    </>
  );
};

export default Orders; 