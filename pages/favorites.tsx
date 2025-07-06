import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from '../lib/supabaseClient';
import { useUser } from '../lib/userContext';

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

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);
  const { user, profile, loading: userLoading } = useUser();
  const isWide = useResponsive();
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userLoading) return;
      
      setLoading(true);
      if (!user || !profile) {
        setLoading(false);
        return;
      }

      try {
        // Fetch favorites for this user, join product info
        const { data: favData, error } = await supabase
          .from('favorites')
          .select(`
            id, 
            product:product_id(
              id, 
              product_name, 
              category, 
              unit_price, 
              image_url
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching favorites:', error);
        } else if (favData) {
          setFavorites(favData);
        }
      } catch (error) {
        console.error('Error in fetchFavorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, profile, userLoading]);

  const removeFavorite = async (favoriteId: number) => {
    setRemoving(favoriteId);
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) {
        console.error('Error removing favorite:', error);
        return;
      }

      // Update local state
      setFavorites(prev => prev.filter(item => item.id !== favoriteId));
    } catch (error) {
      console.error('Error in removeFavorite:', error);
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (product: any) => {
    if (!user || !profile) {
      alert('Please sign in to add items to cart');
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingCartItem } = await supabase
        .from('cart')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existingCartItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart')
          .update({ 
            quantity: existingCartItem.quantity + 1
          })
          .eq('id', existingCartItem.id);

        if (error) {
          console.error('Error updating cart:', error);
          return;
        }
      } else {
        // Add new item to cart
        const { error } = await supabase
          .from('cart')
          .insert([{
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          }]);

        if (error) {
          console.error('Error adding to cart:', error);
          return;
        }
      }

      alert(`${product.product_name} added to cart!`);
    } catch (error) {
      console.error('Error in addToCart:', error);
      alert('Failed to add item to cart');
    }
  };

  if (userLoading) {
    return (
      <div style={{ background: "#f7f7f7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 18, color: "#888" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", padding: isWide ? "18px 24px" : "18px 12px", background: "#fff", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Link href="/" legacyBehavior>
          <a style={{ fontSize: 22, color: "#222", marginRight: 18 }}><i className="fas fa-arrow-left"></i></a>
        </Link>
        <span style={{ flexGrow: 1, textAlign: "center", fontWeight: 600, fontSize: 20, color: "#222" }}>Favorites</span>
        <span style={{ width: 24 }}></span>
      </div>
      {/* Favorites Content */}
      <div style={{ padding: isWide ? 32 : 24, maxWidth: isWide ? 1400 : 900, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 18, color: "#888" }}>Loading...</div>
          </div>
        ) : !user || !profile ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 18, color: "#888", marginBottom: 15 }}>Please sign in to view your favorites.</div>
            <Link href="/sign-in" legacyBehavior>
              <a style={{ background: gold, color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Sign In</a>
            </Link>
          </div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 48, color: "#e0e0e0", marginBottom: 15 }}><i className="fas fa-heart"></i></div>
            <p style={{ fontSize: 18, color: "#888", marginBottom: 5 }}>No favorites yet</p>
            <div style={{ fontSize: 15, color: "#aaa", marginBottom: 20 }}>Add your favorite dishes to see them here!</div>
            <Link href="/" legacyBehavior>
              <a style={{ background: gold, color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Browse Menu</a>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isWide ? "repeat(auto-fill, minmax(260px, 1fr))" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 }}>
            {favorites.map((item) => (
              <div key={item.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "relative", transition: "all 0.2s ease" }}>
                <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
                  <img src={item.product?.image_url || '/img/food.jpg'} alt={item.product?.product_name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} />
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: "4px 10px", fontSize: 13, color: "#555", fontWeight: 500 }}>{item.product?.category}</div>
                  <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8 }}>
                    <button 
                      onClick={() => addToCart(item.product)}
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: "50%", 
                        background: "rgba(255,255,255,0.9)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        border: "none", 
                        cursor: "pointer", 
                        color: "#28c76f", 
                        fontSize: 16, 
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
                    >
                      <i className="fas fa-cart-plus"></i>
                    </button>
                    <button 
                      onClick={() => removeFavorite(item.id)} 
                      disabled={removing === item.id}
                      style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: "50%", 
                        background: "rgba(255,255,255,0.9)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        border: "none", 
                        cursor: removing === item.id ? "not-allowed" : "pointer", 
                        color: "#dc3545", 
                        fontSize: 16, 
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        opacity: removing === item.id ? 0.6 : 1
                      }}
                    >
                      {removing === item.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-trash"></i>
                      )}
                    </button>
                  </div>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, color: "#222", marginBottom: 5, fontSize: 17 }}>{item.product?.product_name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600, color: gold, fontSize: 16 }}>₱{item.product?.unit_price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Bottom Navigation */}
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
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: gold, cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem", color: gold }}><i className="fas fa-heart"></i></div>
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

export default Favorites; 