import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);

      setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, 700);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`loading-screen ${fadeOut ? "loading-fade-out" : ""}`}>

      {/* Background glow */}
      <div className="loading-glow loading-glow-one"></div>
      <div className="loading-glow loading-glow-two"></div>

      <div className="loading-content">

        {/* Logo */}
        <div className="loading-logo-wrapper">

          <div className="loading-ring loading-ring-one"></div>
          <div className="loading-ring loading-ring-two"></div>

          <div className="loading-logo">
            <span>₹</span>
          </div>

        </div>

        {/* Brand */}
        <h1 className="loading-brand">
          Coin<span>Flow</span>
        </h1>

        <p className="loading-tagline">
          Smart money. Better flow.
        </p>

        {/* Loading bar */}
        <div className="loading-bar">
          <div className="loading-bar-progress"></div>
        </div>

        {/* Loading text */}
        <div className="loading-status">
          <span>Initializing your financial dashboard</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;