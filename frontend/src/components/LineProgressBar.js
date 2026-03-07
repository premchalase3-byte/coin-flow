import React from "react";

const LineProgressBar = ({ label, percentage, lineColor }) => {
  return (
    <div className="category-progress-wrapper">

      <div className="category-progress-label">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>

      <div className="category-bar">

        <div
          className="category-progress"
          style={{
            width: `${percentage}%`,
            background: lineColor,
          }}
        ></div>

      </div>

    </div>
  );
};

export default LineProgressBar;