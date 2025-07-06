import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { supabase } from '../lib/supabaseClient';

const GOLD = "#E2B24A";
const mockCategories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Drinks", "Dessert"];

const FoodList = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProducts([]);
        setLoading(false);
        return;
      }
      // Get the food stall for this user
      const { data: stallData, error: stallError } = await supabase
        .from('food_stall')
        .select('id, stall_name')
        .eq('owner_id', user.id)
        .single();
      if (stallError || !stallData) {
        setProducts([]);
        setLoading(false);
        return;
      }
      // Fetch products for this stall
      const { data: productData, error: productError } = await supabase
        .from('product')
        .select('id, product_name, unit_price, category, image_url')
        .eq('food_stall_id', stallData.id);
      setProducts(productData || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => {
        if (!p.category) return false;
        // Normalize both filter and product category to lowercase, and allow 'dessert' to match 'desserts' and vice versa
        const cat = p.category.trim().toLowerCase();
        const sel = selectedCategory.trim().toLowerCase();
        if (sel === 'dessert') return cat === 'dessert' || cat === 'desserts';
        return cat === sel;
      });

  return (
    <>
      <Head>
        <title>Menu Management - Golden Bites</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>
      <div className="app-container" style={{ width: "100vw", margin: 0, background: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div className="main-content" style={{ flexGrow: 1, padding: "20px 32px 80px", overflowY: "auto", background: "#fff", width: "100vw" }}>
          <div className="category-filter-container" style={{ marginBottom: 20, padding: "5px 0", display: "flex", overflowX: "auto", whiteSpace: "nowrap" }}>
            {mockCategories.map(cat => (
              <button
                key={cat}
                className={`category-button${selectedCategory === cat ? " active" : ""}`}
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  marginRight: 10,
                  borderRadius: 20,
                  background: selectedCategory === cat ? GOLD : "#fff",
                  border: `1px solid ${selectedCategory === cat ? GOLD : "#e0e0e0"}`,
                  color: selectedCategory === cat ? "#fff" : "#555",
                  fontWeight: selectedCategory === cat ? 600 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  marginBottom: 0
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="item-count-header" style={{ fontSize: 14, color: "#777", marginBottom: 15, fontWeight: 500 }}>
            {loading ? 'Loading...' : `${filteredProducts.length} item(s) found`}
          </div>
          <div className="product-grid" style={{ display: "grid", gap: 15, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", width: "100%" }}>
            {filteredProducts.map(product => (
              <div
                className="product-card"
                key={product.id}
                style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", overflow: "hidden", cursor: 'pointer' }}
                onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }}
              >
                <div className="product-image-container" style={{ width: "100%", height: 120, overflow: "hidden", background: "#f0f0f0" }}>
                  <img src={product.image_url || '/img/food.jpg'} alt={product.product_name} className="product-image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className="product-info" style={{ padding: 15, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <div className="product-name" style={{ fontSize: 17, fontWeight: 600, color: "#333", marginBottom: 5 }}>{product.product_name}</div>
                  <div className="product-price" style={{ fontSize: 16, color: GOLD, fontWeight: 600 }}>₱{product.unit_price}</div>
                </div>
              </div>
            ))}
            {!loading && filteredProducts.length === 0 && (
              <div style={{ color: "#888", textAlign: "center", gridColumn: "1 / -1" }}>No products found in this category.</div>
            )}
          </div>
        </div>
        <div className="nav-bar" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", background: "#fff", boxShadow: "0 -2px 10px rgba(0,0,0,0.1)", position: "fixed", bottom: 0, left: 0, right: 0, width: "100vw", margin: 0, padding: "12px 0", zIndex: 1000, borderTop: "1px solid #e0e0e0" }}>
          <a href="/dashboard" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#777", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/dashboard'); }}>
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
          <a href="/food_list" className="nav-item active" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#E2B24A", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/food_list'); }}>
            <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}><i className="fa-solid fa-utensils"></i></div>
            <div>Menu</div>
          </a>
          <a href="/overview" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: 13, color: "#777", cursor: "pointer", padding: "5px 8px", textDecoration: "none" }} onClick={e => { e.preventDefault(); router.push('/overview'); }}>
            <div className="nav-icon" style={{ fontSize: 22, marginBottom: 3 }}><i className="fa-solid fa-chart-simple"></i></div>
            <div>Sales</div>
          </a>
        </div>
      </div>
      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', textAlign: 'center', color: '#222' }}>
            <h3 style={{ marginBottom: 18, color: '#222' }}>Delete Product</h3>
            <p style={{ color: '#222' }}>Are you sure you want to delete <b>{selectedProduct.product_name}</b> from your menu?</p>
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 18 }}>
              <button
                style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: GOLD, color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                onClick={async () => {
                  setLoading(true);
                  await supabase.from('product').delete().eq('id', selectedProduct.id);
                  setProducts(products => products.filter(p => p.id !== selectedProduct.id));
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                  setLoading(false);
                }}
              >Delete</button>
              <button
                style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#eee', color: '#333', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { setShowDeleteModal(false); setSelectedProduct(null); }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodList; 