import React from "react";
import "./ActionLoader.css";

const ActionLoader = ({ text = "Loading..." }) => {
  return (
    <div
      className="action-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="action-loader-box">

        {/* Animated loader */}
        <div className="action-loader-spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Loading message */}
        <div className="action-loader-text">
          {text}
        </div>

      </div>
    </div>
  );
};

export default ActionLoader;