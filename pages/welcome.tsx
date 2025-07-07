"use client"
import Head from "next/head"

const Welcome = () => (
  <>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@700&family=Glacial+Indifference:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `url('/img/Golden Bites.png') center center/cover no-repeat`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        position: "relative",
      }}
    >
      {/* Overlay for darkening the background if needed */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.15)",
          zIndex: 1,
        }}
      />
      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          background: "#E2B24A",
          borderRadius: 24,
          padding: "48px 32px 40px 32px",
          minWidth: 380,
          maxWidth: 420,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: 60,
        }}
      >
        <img
          src="/img/GOLDEN BITES LOGO.png"
          alt="Golden Bites Logo"
          style={{
            width: 90,
            height: 90,
            objectFit: "contain",
            marginBottom: 24,
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        />
        <div
          style={{
            fontFamily: "'League Spartan', 'Arial', sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: "#fff",
            textAlign: "center",
            marginBottom: 8,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          GOLDEN BITES
        </div>
        <div
          style={{
            fontFamily: "'Glacial Indifference', 'Arial', sans-serif",
            fontWeight: 400,
            fontSize: 22,
            color: "#fff",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          start ordering now!
        </div>
        <button
          style={{
            width: "100%",
            padding: "16px 0",
            background: "#fff",
            color: "#E2B24A",
            border: "none",
            borderRadius: 32,
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Glacial Indifference', 'Arial', sans-serif",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            letterSpacing: 1,
            transition: "background 0.2s, color 0.2s",
          }}
          onClick={() => (window.location.href = "/landing")}
        >
          CONTINUE
        </button>
      </div>
      {/* Bottom left text */}
      <div
        style={{
          position: "absolute",
          left: 32,
          bottom: 32,
          color: "#fff",
          fontFamily: "'Glacial Indifference', 'Arial', sans-serif",
          fontWeight: 700,
          fontSize: 32,
          textShadow: "0 2px 8px rgba(0,0,0,0.18)",
          zIndex: 2,
        }}
      >
        <div>Made for Campus Life.</div>
        <div>Delivered Right.</div>
      </div>
      {/* Top left logo (CB) - use GOLDEN BITES LOGO.png */}
      <img
        src="/img/GOLDEN BITES LOGO.png"
        alt="CB Logo"
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          width: 80,
          height: 80,
          objectFit: "contain",
          zIndex: 2,
        }}
      />
    </div>
  </>
)

export default Welcome
