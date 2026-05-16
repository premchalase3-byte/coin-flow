import React from "react";

const FloatingBrand = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "22px",
        left: "22px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "10px 18px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(0,255,255,0.18)",
          boxShadow: "0 0 18px rgba(0,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "floatBrand 4s ease-in-out infinite",
        }}
      >
        

        <span
          style={{
            color: "white",
            fontWeight: "700",
            letterSpacing: "3px",
            fontSize: "13px",
            fontFamily: "Poppins, sans-serif",
            textShadow: "0 0 10px rgba(0,255,255,0.45)",
          }}
        >
          PREM'S
        </span>
      </div>

      <style>
        {`
          @keyframes floatBrand {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FloatingBrand;