"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "../lib/supabaseClient"
import { useUser } from "../lib/userContext"

interface Shop {
  id: string
  name: string
  description: string
  image_url: string
  rating: number
  delivery_time: string
  delivery_fee: number
  category: string
  is_open: boolean
  created_at: string
}

const ShopsList = () => {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, profile } = useUser()

  useEffect(() => {
    // Check if user is authenticated and is a shop owner
    if (!user) {
      router.push("/sign-in")
      return
    }

    if (profile && profile.user_type !== "shop") {
      router.push("/home")
      return
    }

    fetchShops()
  }, [user, profile, router])

  const fetchShops = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("shops").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setShops(data || [])
    } catch (error: any) {
      console.error("Error fetching shops:", error)
      setError(error.message || "Failed to load shops")
    } finally {
      setLoading(false)
    }
  }

  const handleShopClick = (shopId: string) => {
    router.push(`/shop/${shopId}`)
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #E2B24A",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#666", fontSize: "16px" }}>Loading shops...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Header */}
      <header
        style={{
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              ←
            </button>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#333", margin: 0 }}>All Shops</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/img/golden-bites-logo.png"
              alt="Golden Bites"
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#E2B24A" }}>Golden Bites</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {error && (
          <div
            style={{
              background: "#fee",
              border: "1px solid #fcc",
              color: "#c33",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {shops.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🏪</div>
            <h2 style={{ fontSize: "24px", color: "#333", marginBottom: "12px" }}>No Shops Found</h2>
            <p style={{ color: "#666", fontSize: "16px" }}>There are currently no shops registered on the platform.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleShopClick(shop.id)}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                {/* Shop Image */}
                <div
                  style={{
                    height: "200px",
                    background: shop.image_url
                      ? `url(${shop.image_url}) center/cover`
                      : "linear-gradient(135deg, #E2B24A, #D4A043)",
                    position: "relative",
                  }}
                >
                  {/* Status Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: shop.is_open ? "#10b981" : "#ef4444",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {shop.is_open ? "Open" : "Closed"}
                  </div>
                </div>

                {/* Shop Info */}
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#333",
                      marginBottom: "8px",
                      lineHeight: "1.2",
                    }}
                  >
                    {shop.name}
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      marginBottom: "16px",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {shop.description}
                  </p>

                  {/* Shop Details */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#fbbf24", fontSize: "16px" }}>⭐</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{shop.rating}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: "#666" }}>{shop.delivery_time}</span>
                      <span style={{ fontSize: "12px", color: "#666" }}>₱{shop.delivery_fee} delivery</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{ marginTop: "12px" }}>
                    <span
                      style={{
                        background: "#f3f4f6",
                        color: "#374151",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {shop.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default ShopsList
