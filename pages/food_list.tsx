"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"
import { useUser } from "../lib/userContext"

const GOLD = "#E2B24A"
const LIGHT_GOLD = "#fff7e0"
const DARK_GOLD = "#d4a043"

const categories = ["All", "Main Course", "Dessert", "Beverages", "Appetizers"]

const FoodList = () => {
  const router = useRouter()
  const { user, profile, loading: userLoading } = useUser()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [stallId, setStallId] = useState<number | null>(null)

  useEffect(() => {
    // Fetch the user's food stall id
    const fetchStallId = async () => {
      if (!user) return
      const { data: stall, error } = await supabase
        .from("food_stall")
        .select("id")
        .eq("owner_id", user.id)
        .single()
      if (stall) setStallId(stall.id)
    }
    fetchStallId()
  }, [user])

  useEffect(() => {
    // Fetch products for this stall
    const fetchMenuItems = async () => {
      if (!stallId) return
      const { data, error } = await supabase
        .from("product")
        .select("id, product_name, unit_price, category, image_url, details, ingredients, food_stall_id")
        .eq("food_stall_id", stallId)
      if (data) setMenuItems(data)
    }
    fetchMenuItems()
  }, [stallId])

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const toggleAvailability = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Toggle availability for item ${id}`)
  }

  const editItem = (id: number) => {
    router.push(`/edit-item/${id}`)
  }

  const deleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      console.log(`Delete item ${id}`)
    }
  }

  return (
    <>
      <Head>
        <title>Menu Management - Golden Bites</title>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 4 }}>Menu Management 🍽️</h1>
                <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
                  Manage your restaurant's menu items and availability
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px", paddingBottom: 120 }}>
          {/* Search and Filters */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 300 }}>
                  <div style={{ position: "relative" }}>
                    <i
                      className="fa-solid fa-search"
                      style={{
                        position: "absolute",
                        left: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#999",
                        fontSize: 16,
                      }}
                    ></i>
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px 12px 48px",
                        border: "2px solid #f0f0f0",
                        borderRadius: 12,
                        fontSize: 16,
                        outline: "none",
                        transition: "border-color 0.2s ease",
                        background: "#fff",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#f0f0f0")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    background: selectedCategory === category ? GOLD : "#fff",
                    color: selectedCategory === category ? "#fff" : "#666",
                    border: selectedCategory === category ? `2px solid ${GOLD}` : "2px solid #e0e0e0",
                    borderRadius: 24,
                    padding: "8px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = GOLD
                      e.currentTarget.style.color = GOLD
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = "#e0e0e0"
                      e.currentTarget.style.color = "#666"
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: item.available ? LIGHT_GOLD : "#f8f8f8",
                  borderRadius: 18,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  padding: 0,
                  marginBottom: 16,
                  border: item.available ? `1.5px solid ${GOLD}` : "1.5px solid #eee",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 260,
                }}
              >
                {/* Menu Item Image */}
                <div style={{ width: "100%", height: 140, background: "#f3f3f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="fa-solid fa-utensils" style={{ fontSize: 48, color: GOLD, opacity: 0.25 }}></i>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#222", margin: 0, flex: 1 }}>{item.product_name}</h3>
                    <div style={{ fontSize: 24, fontWeight: 700, color: GOLD }}>₱{item.unit_price}</div>
                  </div>

                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5, marginBottom: 16 }}>{item.details}</p>

                  <div style={{ display: "flex", gap: 16, marginBottom: 20, fontSize: 12, color: "#888" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="fa-solid fa-clock"></i>
                      {item.prepTime}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <i className="fa-solid fa-fire"></i>
                      {item.popularity}% popular
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      style={{
                        flex: 1,
                        background: item.available ? "#28a745" : "#6c757d",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </button>
                    <button
                      onClick={() => editItem(item.id)}
                      style={{
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <i className="fa-solid fa-utensils" style={{ fontSize: 64, color: "#e0e0e0", marginBottom: 16 }}></i>
              <h3 style={{ fontSize: 20, color: "#666", marginBottom: 8 }}>No items found</h3>
              <p style={{ color: "#999", marginBottom: 20 }}>Try adjusting your search or filters</p>
              <button
                onClick={() => router.push("/add-item")}
                style={{
                  background: GOLD,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Your First Item
              </button>
            </div>
          )}
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
            <i className="fa-solid fa-utensils" style={{ fontSize: 20, marginBottom: 4, color: GOLD }}></i>
            Menu
          </a>
          <a
            href="/overview"
            onClick={(e) => {
              e.preventDefault()
              router.push("/overview")
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
            <i className="fa-solid fa-chart-simple" style={{ fontSize: 20, marginBottom: 4 }}></i>
            Sales
          </a>
        </div>
      </div>
    </>
  )
}

export default FoodList
