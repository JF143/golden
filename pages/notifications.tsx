import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "Order #1234 Completed",
    content: "Your order from Mama's Kitchen is ready for pickup!",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "promo",
    title: "Promo: 20% Off Pasta!",
    content: "Enjoy 20% off all pasta dishes this week only.",
    time: "1 hour ago",
    unread: false,
  },
];

const gold = "#E2B24A";

const useResponsive = () => {
  const [isWide, setIsWide] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 1100);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isWide;
};

const Notifications = () => {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const isWide = useResponsive();
  const router = useRouter();

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", padding: isWide ? "18px 24px" : "18px 12px", background: "#fff", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Link href="/" legacyBehavior>
          <a style={{ fontSize: 22, color: "#222", marginRight: 18 }}><i className="fas fa-arrow-left"></i></a>
        </Link>
        <span style={{ flexGrow: 1, textAlign: "center", fontWeight: 600, fontSize: 20, color: "#222" }}>Notifications</span>
        <span style={{ width: 24 }}></span>
      </div>
      {/* Notifications Content */}
      <div style={{ padding: isWide ? 32 : 24, maxWidth: isWide ? 1400 : 900, margin: "0 auto" }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 48, color: "#e0e0e0", marginBottom: 15 }}><i className="fas fa-bell"></i></div>
            <p style={{ fontSize: 18, color: "#888", marginBottom: 5 }}>No notifications</p>
            <div style={{ fontSize: 15, color: "#aaa" }}>You're all caught up!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ background: n.unread ? "#f8f6ef" : "#fff", borderLeft: n.unread ? `3px solid ${gold}` : "3px solid transparent", borderRadius: 12, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.2s ease", cursor: "pointer", position: "relative" }} onClick={() => markRead(n.id)}>
                <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: n.type === "order" ? "#fff8e1" : n.type === "promo" ? "#e3f2fd" : "#f5f5f5", color: n.type === "order" ? gold : n.type === "promo" ? "#1976d2" : "#616161" }}>
                    <i className={n.type === "order" ? "fas fa-receipt" : n.type === "promo" ? "fas fa-percent" : "fas fa-info-circle"}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2, fontSize: 17 }}>{n.title}</div>
                    <div style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>{n.content}</div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>{n.time}</div>
                  </div>
                  {n.unread && <button onClick={e => { e.stopPropagation(); markRead(n.id); }} style={{ background: gold, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 14, fontWeight: 500, cursor: "pointer", marginLeft: 10 }}>Mark Read</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Bottom Navigation (reuse from index) */}
      <nav style={{
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
      }}>
        <Link href="/" legacyBehavior>
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: "#555", cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}><i className="fas fa-home"></i></div>
            <span>Home</span>
          </a>
        </Link>
        <a
          href="/cart"
          onClick={e => { e.preventDefault(); router.push('/cart'); }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: "#555", cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}
        >
          <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}><i className="fas fa-shopping-cart"></i></div>
          <span>Cart</span>
        </a>
        <Link href="/shops-list" legacyBehavior>
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: "#555", cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}><i className="fas fa-store"></i></div>
            <span>Shops</span>
          </a>
        </Link>
        <Link href="/favorites" legacyBehavior>
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: "#555", cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}><i className="fas fa-heart"></i></div>
            <span>Favorites</span>
          </a>
        </Link>
        <Link href="/notifications" legacyBehavior>
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: gold, cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem", color: gold }}><i className="fas fa-bell"></i></div>
            <span>Notifications</span>
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default Notifications; 