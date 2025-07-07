"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "../lib/supabaseClient"
import { useUser } from "../lib/userContext"

const categories = [
  { name: "Breakfast", icon: "🍳" },
  { name: "Lunch", icon: "🍱" },
  { name: "Dinner", icon: "🍽️" },
  { name: "Snacks", icon: "🍟" },
  { name: "Drinks", icon: "🥤" },
  { name: "Desserts", icon: "🍨" },
]

const useResponsive = () => {
  const [isWide, setIsWide] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 1100)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isWide
}

const ShopProducts = () => {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const isWide = useResponsive()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [stallMap, setStallMap] = useState<Record<number, string>>({})
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { user, profile, loading: userLoading, signOut } = useUser()

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("product")
        .select("id, product_name, unit_price, category, image_url, food_stall_id")
      if (data) setDbProducts(data)
    }
    fetchProducts()

    const fetchStalls = async () => {
      const { data, error } = await supabase.from("food_stall").select("id, stall_name")
      if (data) {
        const map: Record<number, string> = {}
        data.forEach((stall: any) => {
          map[stall.id] = stall.stall_name
        })
        setStallMap(map)
      }
    }
    fetchStalls()
  }, [])

  const filteredProducts = dbProducts.filter(
    (p) =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.product_name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    inputRef.current?.focus()
  }

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/"
  }

  const addToCart = async (product: any) => {
    if (!user || !profile) {
      setActionMessage("You must be logged in to add to cart.")
      return
    }

    try {
      const { data: existingCartItem } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single()

      if (existingCartItem) {
        const { error } = await supabase
          .from("cart")
          .update({
            quantity: existingCartItem.quantity + 1,
          })
          .eq("id", existingCartItem.id)

        if (error) {
          setActionMessage("Failed to update cart: " + error.message)
          return
        }
      } else {
        const { error } = await supabase.from("cart").insert([
          {
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          },
        ])

        if (error) {
          setActionMessage("Failed to add to cart: " + error.message)
          return
        }
      }

      setActionMessage("Added to cart successfully!")
    } catch (error) {
      console.error("Error in addToCart:", error)
      setActionMessage("Failed to add item to cart")
    }
  }

  const addToFavorites = async (product: any) => {
    if (!user || !profile) {
      setActionMessage("You must be logged in to add to favorites.")
      return
    }

    try {
      const { error } = await supabase.from("favorites").insert([{ user_id: user.id, product_id: product.id }])

      if (error) {
        setActionMessage("Failed to add to favorites: " + error.message)
      } else {
        setActionMessage("Added to favorites successfully!")
      }
    } catch (error) {
      console.error("Error in addToFavorites:", error)
      setActionMessage("Failed to add to favorites")
    }
  }

  return (
    <div style={{ background: "#f7f7f7", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: isWide ? 1400 : 900,
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: isWide ? "32px 48px" : "16px 8px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            margin: isWide ? "0 0 18px 0" : "0 0 10px 0",
            padding: isWide ? "24px 24px 18px 24px" : "15px 10px 12px 10px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            minHeight: 48,
            display: "flex",
            flexDirection: isWide ? "row" : "column",
            alignItems: isWide ? "center" : "flex-start",
            justifyContent: "space-between",
            gap: isWide ? 32 : 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="greeting">
              <h1 style={{ fontSize: isWide ? 28 : 22, fontWeight: 600, color: "#222", margin: 0 }}>
                Browse Restaurants
              </h1>
              <p style={{ fontSize: isWide ? 18 : 15, color: "#555", margin: 0 }}>
                Discover amazing food from local restaurants
              </p>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                marginTop: 15,
                borderRadius: 8,
                overflow: "hidden",
                background: "#f7f7f7",
                border: "1px solid #e0e0e0",
              }}
            >
              <input
                ref={inputRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for food or restaurants..."
                style={{
                  flexGrow: 1,
                  border: "none",
                  padding: "12px 15px",
                  fontSize: isWide ? 18 : 15,
                  outline: "none",
                  background: "transparent",
                  color: "#222",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#E2B24A",
                  color: "#fff",
                  border: "none",
                  padding: "12px 20px",
                  fontSize: isWide ? 18 : 15,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div style={{ position: "relative" }}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    background: "#f7f7f7",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                  }}
                >
                  <img
                    src="/img/profile.jpg"
                    alt="Profile"
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span style={{ fontSize: isWide ? 16 : 14, color: "#222", fontWeight: 500 }}>
                    {profile ? `${profile.first_name || profile.username}` : user.email}
                  </span>
                  <i className="fas fa-chevron-down" style={{ fontSize: 12, color: "#666" }}></i>
                </button>
                {showUserMenu && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      background: "#fff",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      padding: "8px 0",
                      minWidth: 160,
                      zIndex: 1001,
                      marginTop: 4,
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        color: "#666",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/sign-in" legacyBehavior>
                <a
                  style={{
                    background: "#E2B24A",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: isWide ? 16 : 14,
                  }}
                >
                  Sign In
                </a>
              </Link>
            )}
          </div>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: isWide ? 24 : 16 }}>
          <h2 style={{ fontSize: isWide ? 22 : 18, fontWeight: 600, color: "#222", marginBottom: isWide ? 16 : 12 }}>
            Categories
          </h2>
          <div style={{ display: "flex", gap: isWide ? 16 : 12, overflowX: "auto", paddingBottom: 4 }}>
            <button
              onClick={() => setSelectedCategory("All")}
              style={{
                background: selectedCategory === "All" ? "#E2B24A" : "#fff",
                color: selectedCategory === "All" ? "#fff" : "#222",
                border: "1px solid #e0e0e0",
                borderRadius: 20,
                padding: isWide ? "12px 20px" : "10px 16px",
                fontSize: isWide ? 16 : 14,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: "fit-content",
              }}
            >
              <span>🍽️</span>
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  background: selectedCategory === category.name ? "#E2B24A" : "#fff",
                  color: selectedCategory === category.name ? "#fff" : "#222",
                  border: "1px solid #e0e0e0",
                  borderRadius: 20,
                  padding: isWide ? "12px 20px" : "10px 16px",
                  fontSize: isWide ? 16 : 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: "fit-content",
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div style={{ marginBottom: isWide ? 24 : 16 }}>
          <h2 style={{ fontSize: isWide ? 22 : 18, fontWeight: 600, color: "#222", marginBottom: isWide ? 16 : 12 }}>
            {selectedCategory === "All" ? "All Products" : `${selectedCategory} Items`}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isWide
                ? "repeat(auto-fill, minmax(280px, 1fr))"
                : "repeat(auto-fill, minmax(240px, 1fr))",
              gap: isWide ? 20 : 16,
            }}
          >
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p)
                  setShowActionModal(true)
                  setActionMessage(null)
                }}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ width: "100%", paddingTop: "75%", position: "relative", background: "#f0f0f0" }}>
                  <img
                    src={p.image_url || "/img/food.jpg"}
                    alt={p.product_name}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div
                  style={{
                    padding: isWide ? "18px 20px" : "10px 12px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: isWide ? 20 : 15,
                      fontWeight: 600,
                      marginBottom: 4,
                      color: "#222",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: isWide ? "2.8em" : "2.4em",
                    }}
                  >
                    {p.product_name}
                  </div>
                  <div
                    style={{
                      fontSize: isWide ? 16 : 13,
                      color: "#aaa",
                      marginBottom: 6,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {stallMap[p.food_stall_id] || "—"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                    }}
                  >
                    <div style={{ fontSize: isWide ? 18 : 15, color: "#222", fontWeight: 700 }}>₱{p.unit_price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav
          style={{
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
          }}
        >
          <Link href="/home" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-home"></i>
              </div>
              <span>Home</span>
            </a>
          </Link>
          <Link href="/cart" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-shopping-cart"></i>
              </div>
              <span>Cart</span>
            </a>
          </Link>
          <Link href="/shop-products" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#E2B24A",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem", color: "#E2B24A" }}>
                <i className="fas fa-store"></i>
              </div>
              <span>Shops</span>
            </a>
          </Link>
          <Link href="/favorites" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-heart"></i>
              </div>
              <span>Favorites</span>
            </a>
          </Link>
          <Link href="/notifications" legacyBehavior>
            <a
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.7rem",
                color: "#555",
                cursor: "pointer",
                textDecoration: "none",
                padding: "5px",
                flex: 1,
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "3px", fontSize: "1.2rem" }}>
                <i className="fas fa-bell"></i>
              </div>
              <span>Notifications</span>
            </a>
          </Link>
        </nav>
      </div>

      {/* Action Modal for Add to Cart / Favorites */}
      {showActionModal && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              textAlign: "center",
              color: "#222",
            }}
          >
            <h3 style={{ marginBottom: 18, color: "#222" }}>{selectedProduct.product_name}</h3>
            <p style={{ color: "#222" }}>What would you like to do?</p>
            {actionMessage && (
              <div
                style={{
                  color: actionMessage.includes("success") ? "#006421" : "#c72a00",
                  background: actionMessage.includes("success") ? "#e6ffed" : "#ffebe6",
                  border: "1px solid",
                  borderColor: actionMessage.includes("success") ? "#a3e2b4" : "#ffc4b3",
                  padding: "10px",
                  borderRadius: 6,
                  margin: "10px 0",
                }}
              >
                {actionMessage}
              </div>
            )}
            <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 18 }}>
              <button
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "#E2B24A",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                disabled={actionLoading}
                onClick={async () => {
                  setActionLoading(true)
                  setActionMessage(null)
                  await addToCart(selectedProduct)
                  setActionLoading(false)
                }}
              >
                Add to Cart
              </button>
              <button
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "#E2B24A",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                disabled={actionLoading}
                onClick={async () => {
                  setActionLoading(true)
                  setActionMessage(null)
                  await addToFavorites(selectedProduct)
                  setActionLoading(false)
                }}
              >
                Add to Favorites
              </button>
              <button
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "#eee",
                  color: "#333",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowActionModal(false)
                  setSelectedProduct(null)
                  setActionMessage(null)
                }}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopProducts
