import React, { useEffect, useState } from "react";
import "./CircularProgressBar.css";

const CircularProgressBar = ({ percentage, color }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const progress = circumference - (percentage / 100) * circumference;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    setTimeout(() => {
      setOffset(progress);
    }, 200);
  }, [progress]);

  return (
    <div className="circular-progressbar">
      <svg width="120" height="120" viewBox="0 0 120 120">

        {/* Background circle */}

        <circle
          className="circle-bg"
          cx="60"
          cy="60"
          r={radius}
        />

        {/* Progress circle */}

        <circle
          className="circle-progress"
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />

      </svg>

      <div className="percentage">
        {percentage}%
      </div>
    </div>
  );
};

export default CircularProgressBar;