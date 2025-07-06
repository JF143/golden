import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../lib/userContext';

const Dashboard = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [shopName, setShopName] = useState('');
  const [editingShopName, setEditingShopName] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [runningOrdersCount, setRunningOrdersCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingShopName, setOnboardingShopName] = useState("");
  const [stallId, setStallId] = useState<string | null>(null);
  const router = useRouter();
  const { profile, user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!user) return;
    // Fetch current user's food stall using UUID
    const fetchStallAndProducts = async () => {
      const { data: stallData } = await supabase
        .from('food_stall')
        .select('id, stall_name, owner_id, staff_name')
        .eq('owner_id', user.id)
        .single();
      if (stallData) {
        setStallId(stallData.id);
        setShopName(stallData.stall_name);
        setEditingShopName(stallData.stall_name);
        // Fetch products for this stall using the integer id
        const { data: productData } = await supabase
          .from('product')
          .select('id, product_name, image_url, food_stall_id')
          .eq('food_stall_id', stallData.id);
        if (productData) setProducts(productData);
        setShowOnboarding(false);
      } else {
        setStallId(null);
        setShopName('');
        setEditingShopName('');
        setProducts([]);
        setShowOnboarding(true);
      }
      setUserName(profile?.first_name || profile?.username || '');
      setEmail(profile?.email || '');
      // Optionally fetch contact number if you store it in profile
    };
    fetchStallAndProducts();
  }, [user, profile]);

  const handleOnboardingSubmit = async () => {
    if (!user || !onboardingShopName.trim()) return;
    // Insert new food_stall row
    const { error } = await supabase
      .from('food_stall')
      .insert([{ stall_name: onboardingShopName.trim(), owner_id: user.id, service_type: 'Pickup' }]);
    if (error) {
      alert('Failed to create shop: ' + error.message);
      return;
    }
    setShowOnboarding(false);
    setShopName(onboardingShopName.trim());
    setEditingShopName(onboardingShopName.trim());
    // Refetch stall/products
    const { data: stallData } = await supabase
      .from('food_stall')
      .select('id, stall_name')
      .eq('owner_id', user.id)
      .single();
    if (stallData) {
      setStallId(stallData.id);
    }
  };

  const handleSaveShopName = async () => {
    if (!user) return;
    if (stallId) {
      // Update existing food_stall
      const { error: updateError } = await supabase
        .from('food_stall')
        .update({ stall_name: editingShopName })
        .eq('id', stallId);
      if (updateError) {
        alert('Failed to update shop name: ' + updateError.message);
        return;
      }
    } else {
      // Insert new food_stall
      const { error: insertError } = await supabase
        .from('food_stall')
        .insert([{ stall_name: editingShopName, owner_id: user.id, service_type: 'Pickup' }]);
      if (insertError) {
        alert('Failed to create shop: ' + insertError.message);
        return;
      }
    }
    // Re-fetch the updated shop name from Supabase
    const { data: stallData, error: fetchError } = await supabase
      .from('food_stall')
      .select('id, stall_name')
      .eq('owner_id', user.id)
      .single();
    if (fetchError || !stallData) {
      alert('Failed to fetch updated shop name.');
      return;
    }
    setStallId(stallData.id);
    setShopName(stallData.stall_name);
    setEditingShopName(stallData.stall_name);
    setShowSettings(false);
  };

  // Helper to get profile image or initials
  const getProfileImage = () => {
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.picture) return user.user_metadata.picture;
    return null;
  };
  const getInitials = () => {
    if (profile?.first_name) return profile.first_name[0].toUpperCase();
    if (profile?.username) return profile.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return '?';
  };

  // State for user menu/settings
  const handleProfileClick = () => setShowSettings(true);

  return (
    <>
      <Head>
        <title>Dashboard - {shopName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div className="app-container" style={{ minHeight: "100vh", background: "#f5f7fa", display: "flex", flexDirection: "column", alignItems: "center", width: "100vw" }}>
        <div style={{ width: '100vw', background: 'linear-gradient(90deg, #E2B24A 0%, #fffbe6 100%)', height: 8 }} />

        {/* Modern Header Card */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'transparent',
          marginTop: 24,
          marginBottom: 32
        }}>
          <div style={{
            width: '90%',
            maxWidth: 900,
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: "'League Spartan', 'Glacial Indifference', 'Inter', sans-serif", fontSize: 28, fontWeight: 700, color: '#222', marginBottom: 4 }}>
                Hi, {profile?.first_name || profile?.username || user?.email?.split('@')[0] || 'there'}!
              </div>
              <div style={{ fontSize: 16, color: '#888', fontWeight: 400 }}>
                What would you like to manage today?
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleProfileClick}
                style={{ background: '#f7f7f7', border: 'none', borderRadius: 12, padding: '4px 12px 4px 4px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e0e0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                  {getProfileImage() ? (
                    <img src={getProfileImage()} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 20, color: '#888', fontWeight: 700 }}>{getInitials()}</span>
                  )}
                </div>
                <span style={{ fontSize: 16, color: '#222', fontWeight: 500, marginRight: 4 }}>
                  {profile?.first_name || profile?.username || user?.email?.split('@')[0] || 'User'}
                </span>
                <i className="fas fa-chevron-down" style={{ fontSize: 14, color: '#888' }}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content-wrapper" style={{ flexGrow: 1, padding: "32px 16px 100px 16px", width: "100vw", margin: 0, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Stats */}
          <div className="stats-container" style={{ display: "flex", justifyContent: "center", gap: 32, width: "100%", marginBottom: 32, flexWrap: "wrap" }}>
            <div className="stat-box running-orders" style={{ background: "#fff", borderRadius: 12, padding: "24px 32px", minWidth: 180, flex: 1, textAlign: "left", boxShadow: "0 3px 10px rgba(0,0,0,0.07)", margin: 8 }}>
              <div className="stat-icon-bg" style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 20, background: "#fff7e0", color: "#E2B24A" }}>
                <i className="fas fa-running"></i>
              </div>
              <div className="stat-number" style={{ fontSize: 26, fontWeight: 700, color: "#333", marginBottom: 4 }}>{runningOrdersCount}</div>
              <div className="stat-label" style={{ fontSize: 15, color: "#555", fontWeight: 500 }}>RUNNING ORDERS</div>
            </div>
            <div className="stat-box completed-orders" style={{ background: "#fff", borderRadius: 12, padding: "24px 32px", minWidth: 180, flex: 1, textAlign: "left", boxShadow: "0 3px 10px rgba(0,0,0,0.07)", margin: 8 }}>
              <div className="stat-icon-bg" style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, fontSize: 20, background: "#fff7e0", color: "#E2B24A" }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-number" style={{ fontSize: 26, fontWeight: 700, color: "#333", marginBottom: 4 }}>{completedOrdersCount}</div>
              <div className="stat-label" style={{ fontSize: 15, color: "#555", fontWeight: 500 }}>COMPLETED ORDERS</div>
            </div>
          </div>

          {/* Sales Card */}
          <div className="data-section-card" style={{ padding: 28, marginBottom: 32, background: "#fff", borderRadius: 12, boxShadow: "0 3px 10px rgba(0,0,0,0.07)", width: "100%" }}>
            <div className="sales-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div className="sales-amount" style={{ fontSize: 22, fontWeight: 700, color: "#333" }}>
                Total Sales: ₱{totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <a href="#" className="see-details-link" style={{ color: "#E2B24A", fontSize: 15, textDecoration: "none", fontWeight: 500 }} onClick={e => { e.preventDefault(); router.push('/overview'); }}>See Details</a>
            </div>
            <div className="sales-chart-placeholder" style={{ height: 100, background: "#f0f0f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb", fontSize: 16 }}>
              <span>Sales chart coming soon!</span>
            </div>
          </div>

          {/* Product Cards */}
          {products.length > 0 && (
            <div style={{ width: '100%', marginTop: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 16 }}>Your Products</h2>
              <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {products.map((product: any) => (
                  <div key={product.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: 140, overflow: 'hidden', background: '#f0f0f0' }}>
                      <img src={product.image_url || '/img/food.jpg'} alt={product.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 15, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: '#333', marginBottom: 5 }}>{product.product_name}</div>
                      <div style={{ fontSize: 14, color: '#aaa', marginBottom: 6 }}>{product.food_stall && product.food_stall.length > 0 ? product.food_stall[0].stall_name : shopName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="nav-bar" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", background: "#fff", boxShadow: "0 -2px 10px rgba(0,0,0,0.1)", position: "fixed", bottom: 0, left: 0, right: 0, width: "100vw", margin: 0, padding: "12px 0", zIndex: 1000, borderTop: "1px solid #e0e0e0" }}>
          <a href="/dashboard" className="nav-item active" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#E2B24A", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/dashboard'); }}>
            <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}><i className="fa-solid fa-house"></i></div>
            <div>Home</div>
          </a>
          <a href="/orders" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#777", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/orders'); }}>
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

        {/* Settings Modal */}
        {showSettings && (
          <div className="modal" style={{ display: "flex", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, alignItems: "center", justifyContent: "center" }}>
            <div className="modal-content" style={{ background: "#fff", padding: 0, borderRadius: 10, width: "90%", maxWidth: 420, boxShadow: "0 5px 20px rgba(0,0,0,0.25)" }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #e0e0e0" }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Settings</h2>
                <span className="close-modal" style={{ fontSize: 24, cursor: "pointer", color: "#bbb" }} onClick={() => setShowSettings(false)}>&times;</span>
              </div>
              <div className="modal-body" style={{ padding: 20 }}>
                <div className="user-info-section">
                  <h3 style={{ fontSize: 16, marginBottom: 15, fontWeight: 600, color: "#E2B24A" }}>User Information</h3>
                  <div className="user-info-item" style={{ display: "flex", marginBottom: 12, fontSize: 14 }}>
                    <label style={{ fontWeight: 500, width: 90, color: "#555" }}>Name:</label>
                    <span style={{ color: "#333" }}>{userName || "N/A"}</span>
                  </div>
                  <div className="user-info-item" style={{ display: "flex", marginBottom: 12, fontSize: 14 }}>
                    <label style={{ fontWeight: 500, width: 90, color: "#555" }}>Shop Name:</label>
                    <span style={{ color: "#333" }}>{shopName || "N/A"}</span>
                  </div>
                  <div className="user-info-item" style={{ display: "flex", marginBottom: 12, fontSize: 14 }}>
                    <label style={{ fontWeight: 500, width: 90, color: "#555" }}>Email:</label>
                    <span style={{ color: "#333" }}>{email || "N/A"}</span>
                  </div>
                  <div className="user-info-item" style={{ display: "flex", marginBottom: 12, fontSize: 14 }}>
                    <label style={{ fontWeight: 500, width: 90, color: "#555" }}>Phone:</label>
                    <span style={{ color: "#333" }}>{contactNumber || "N/A"}</span>
                  </div>
                </div>
                <div className="edit-shop-name-section">
                  <h3 style={{ fontSize: 16, marginBottom: 15, fontWeight: 600, color: "#E2B24A" }}>Edit Shop Name</h3>
                  <input
                    type="text"
                    value={editingShopName}
                    onChange={(e) => setEditingShopName(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: 15, border: "1px solid #e0e0e0", borderRadius: 8, background: '#fff', color: '#222' }}
                  />
                  <button
                    className="btn-save-shop-name"
                    style={{ display: "inline-block", padding: "10px 30px", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", background: "#E2B24A", color: "#fff", textDecoration: "none" }}
                    onClick={handleSaveShopName}
                  >
                    Save
                  </button>
                </div>
                <div className="logout-container" style={{ textAlign: "center", marginTop: 25, paddingTop: 15, borderTop: "1px solid #e0e0e0" }}>
                  <button className="btn-logout" style={{ display: "inline-block", padding: "10px 30px", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", background: "#dc3545", color: "#fff", textDecoration: "none" }} onClick={async () => { await supabase.auth.signOut(); router.push('/welcome'); }}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Modal for New Merchants */}
        {showOnboarding && (
          <div className="modal" style={{ display: "flex", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, alignItems: "center", justifyContent: "center" }}>
            <div className="modal-content" style={{ background: "#fff", padding: 0, borderRadius: 10, width: "90%", maxWidth: 420, boxShadow: "0 5px 20px rgba(0,0,0,0.25)" }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderBottom: "1px solid #e0e0e0" }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Set Up Your Shop</h2>
              </div>
              <div className="modal-body" style={{ padding: 20 }}>
                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="onboarding-shop-name" style={{ display: 'block', fontWeight: 500, fontSize: 14, color: '#333', marginBottom: 8 }}>Shop Name</label>
                  <input
                    id="onboarding-shop-name"
                    type="text"
                    value={onboardingShopName}
                    onChange={e => setOnboardingShopName(e.target.value)}
                    style={{ width: '100%', padding: '12px 15px', border: '1px solid #ccd0d5', borderRadius: 6, fontSize: 15, boxSizing: 'border-box', background: '#fff', color: '#222' }}
                    placeholder="Enter your shop name"
                  />
                </div>
                <button
                  style={{ width: '100%', padding: 12, background: '#E2B24A', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 10 }}
                  onClick={handleOnboardingSubmit}
                >
                  Save Shop Name
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        body { background: #f5f7fa; }
        .app-container { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      `}</style>
    </>
  );
};

export default Dashboard; 