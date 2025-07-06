import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const mockShops = [
  {
    id: 1,
    name: "Mama's Kitchen",
    address: "Dormitory Lane, University Campus",
    rating: 4.8,
    image: null,
  },
  {
    id: 2,
    name: "Sweet Treats",
    address: "Food Court, Main Building",
    rating: 4.7,
    image: null,
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

const ShopsList = () => {
  const [search, setSearch] = React.useState("");
  const isWide = useResponsive();
  const router = useRouter();
  const filteredShops = mockShops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: isWide ? "18px 24px" : "18px 12px", background: "#fff", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <span style={{ fontWeight: 600, fontSize: 20, color: "#222" }}>Discover Shops</span>
      </div>
      {/* Search Bar */}
      <div style={{ padding: isWide ? "32px 32px 0 32px" : "24px 24px 0 24px", maxWidth: isWide ? 1400 : 900, margin: "0 auto" }}>
        <form onSubmit={e => e.preventDefault()} style={{ display: "flex", borderRadius: 8, overflow: "hidden", background: "#fff", border: "1px solid #e0e0e0", marginBottom: 24 }}>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shops by name..."
            style={{ flexGrow: 1, border: "none", padding: "14px 18px", fontSize: 16, outline: "none", background: "transparent", color: "#222" }}
          />
          <button type="submit" style={{ border: "none", borderLeft: "1px solid #e0e0e0", background: "transparent", color: gold, padding: "0 18px", cursor: "pointer", fontSize: 20 }}>
            <i className="fas fa-search"></i>
          </button>
        </form>
        {/* Shop Cards Grid */}
        {filteredShops.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 48, color: "#e0e0e0", marginBottom: 15 }}><i className="fas fa-store-slash"></i></div>
            <p style={{ fontSize: 18, marginBottom: 5 }}>No Shops Found</p>
            <div style={{ fontSize: 15, color: "#aaa" }}>There are currently no shops available. Please check back soon!</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isWide ? "repeat(auto-fill, minmax(260px, 1fr))" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {filteredShops.map((shop) => (
              <a key={shop.id} href="#" style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s" }}>
                <div style={{ width: "100%", height: 140, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#cccccc" }}>
                  <i className="fas fa-store" style={{ fontSize: 40 }}></i>
                </div>
                <div style={{ padding: 15 }}>
                  <h3 style={{ margin: 0, marginBottom: 6, fontSize: 18, fontWeight: 600, color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shop.name}</h3>
                  <p style={{ margin: 0, marginBottom: 4, fontSize: 15, color: "#aaa", lineHeight: 1.4, height: 24, overflow: "hidden", textOverflow: "ellipsis" }}>{shop.address}</p>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 15, color: "#888", marginTop: 8 }}>
                    <i className="fas fa-star" style={{ color: "#ffc107", marginRight: 3 }}></i> {shop.rating}
                  </div>
                </div>
              </a>
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
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: gold, cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem", color: gold }}><i className="fas fa-store"></i></div>
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
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: "#555", cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}><i className="fas fa-bell"></i></div>
            <span>Notifications</span>
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default ShopsList; 