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

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const { user, profile, loading: userLoading } = useUser();
  const isWide = useResponsive();
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      if (userLoading) return;
      
      setLoading(true);
      if (!user || !profile) {
        setLoading(false);
        return;
      }

      try {
        // Fetch cart items for this user, join product info
        const { data: cartData, error } = await supabase
          .from('cart')
          .select(`
            id, 
            quantity, 
            product:product_id(
              id, 
              product_name, 
              unit_price, 
              image_url,
              category
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching cart:', error);
        } else if (cartData) {
          setCart(cartData);
        }
      } catch (error) {
        console.error('Error in fetchCart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, profile, userLoading]);

  const total = cart.reduce((sum, item) => sum + (item.product?.unit_price || 0) * item.quantity, 0);

  const updateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(cartId);
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
        .eq('id', cartId);

      if (error) {
        console.error('Error updating quantity:', error);
        return;
      }

      // Update local state
      setCart(prev => prev.map(item => 
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      console.error('Error in updateQuantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartId: number) => {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartId);

      if (error) {
        console.error('Error removing item:', error);
        return;
      }

      // Update local state
      setCart(prev => prev.filter(item => item.id !== cartId));
    } catch (error) {
      console.error('Error in removeItem:', error);
    }
  };

  const updateQty = (id: number, delta: number) => {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    // TODO: Implement checkout flow
    alert('Checkout functionality coming soon!');
  };

  if (userLoading) {
    return (
      <div style={{ background: "#f7f7f7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 18, color: "#888" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", padding: isWide ? "18px 24px" : "18px 12px", background: "#fff", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <Link href="/" legacyBehavior>
          <a style={{ fontSize: 22, color: "#222", marginRight: 18 }}><i className="fas fa-arrow-left"></i></a>
        </Link>
        <span style={{ flexGrow: 1, textAlign: "center", fontWeight: 600, fontSize: 20, color: "#222" }}>Your Cart</span>
        <span style={{ width: 24 }}></span>
      </div>
      {/* Cart Content */}
      <div style={{ padding: isWide ? 32 : 24, maxWidth: isWide ? 1400 : 900, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 18, color: "#888" }}>Loading...</div>
          </div>
        ) : !user || !profile ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 18, color: "#888", marginBottom: 15 }}>Please sign in to view your cart.</div>
            <Link href="/sign-in" legacyBehavior>
              <a style={{ background: gold, color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Sign In</a>
            </Link>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 12, margin: "20px 0" }}>
            <div style={{ fontSize: 48, color: "#e0e0e0", marginBottom: 15 }}><i className="fas fa-shopping-cart"></i></div>
            <p style={{ fontSize: 18, color: "#888", marginBottom: 5 }}>Your cart is empty</p>
            <div style={{ fontSize: 15, color: "#aaa", marginBottom: 20 }}>Add some delicious food to get started!</div>
            <Link href="/" legacyBehavior>
              <a style={{ background: gold, color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>Browse Menu</a>
            </Link>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: 15 }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "flex-start", padding: "18px 0", borderBottom: "1px solid #e0e0e0" }}>
                <img src={item.product?.image_url || '/img/food.jpg'} alt={item.product?.product_name} style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover", marginRight: 15, border: "1px solid #e0e0e0" }} />
                <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ fontWeight: 600, fontSize: 17, color: "#222", marginBottom: 4 }}>{item.product?.product_name}</div>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>{item.product?.category}</div>
                  <div style={{ fontSize: 15, color: "#555", marginBottom: 8 }}>₱{item.product?.unit_price} / item</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#222" }}>Subtotal: ₱{(item.product?.unit_price || 0) * item.quantity}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minHeight: 80, marginLeft: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", background: "#f7f7f7", borderRadius: 20, padding: 4, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)" }}>
                    <button 
                      onClick={() => updateQty(item.id, -1)} 
                      disabled={updating === item.id || item.quantity === 1}
                      style={{ 
                        background: "#fff", 
                        color: gold, 
                        border: "1px solid #e0e0e0", 
                        borderRadius: "50%", 
                        width: 28, 
                        height: 28, 
                        fontSize: 18, 
                        fontWeight: 500, 
                        cursor: updating === item.id || item.quantity === 1 ? "not-allowed" : "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        marginRight: 2,
                        opacity: updating === item.id ? 0.6 : 1
                      }}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 600, padding: "0 8px", width: 20, textAlign: "center" }}>
                      {updating === item.id ? "..." : item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQty(item.id, 1)} 
                      disabled={updating === item.id}
                      style={{ 
                        background: "#fff", 
                        color: gold, 
                        border: "1px solid #e0e0e0", 
                        borderRadius: "50%", 
                        width: 28, 
                        height: 28, 
                        fontSize: 18, 
                        fontWeight: 500, 
                        cursor: updating === item.id ? "not-allowed" : "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        marginLeft: 2,
                        opacity: updating === item.id ? 0.6 : 1
                      }}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    disabled={updating === item.id}
                    style={{ 
                      background: "none", 
                      color: "#dc3545", 
                      border: "none", 
                      borderRadius: 4, 
                      padding: 5, 
                      fontSize: 14, 
                      fontWeight: 500, 
                      cursor: updating === item.id ? "not-allowed" : "pointer", 
                      marginTop: 10,
                      opacity: updating === item.id ? 0.6 : 1
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Bottom Summary Bar */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 60, left: 0, right: 0, maxWidth: isWide ? 1400 : 900, margin: "0 auto", background: "#fff", padding: "15px 20px", boxShadow: "0 -2px 10px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e0e0e0", zIndex: 999 }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 15, color: "#aaa", marginBottom: 2 }}>Total</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#222" }}>₱{total.toFixed(2)}</div>
          </div>
          <button 
            onClick={handleCheckout}
            style={{ 
              background: gold, 
              color: "#fff", 
              border: "none", 
              borderRadius: 8, 
              padding: "12px 25px", 
              fontSize: 18, 
              fontWeight: 600, 
              cursor: "pointer", 
              minWidth: 140 
            }}
          >
            Checkout
          </button>
        </div>
      )}
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
          style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: gold, cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}
        >
          <div style={{ marginBottom: "3px", fontSize: "1.2rem", color: gold }}><i className="fas fa-shopping-cart"></i></div>
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
          <a style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "0.7rem", color: "#555", cursor: "pointer", textDecoration: "none", padding: "5px", flex: 1, textAlign: "center" }}>
            <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}><i className="fas fa-bell"></i></div>
            <span>Notifications</span>
          </a>
        </Link>
      </nav>
    </div>
  );
};

export default Cart; 