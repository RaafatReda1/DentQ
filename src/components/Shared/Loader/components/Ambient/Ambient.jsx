import React from "react";
import "./Ambient.css";

const Ambient = () => {
  return (
    <div className="ambient">
      <div className="shCircle c1"></div>
      <div className="shCircle c2"></div>
      <div className="shCircle c3"></div>
      <div className="shCross x1"></div>
      <div className="shCross x2"></div>
      <div className="shDiamond d1"></div>
      <div className="shDiamond d2"></div>
      <div className="shDot dt1"></div>
      <div className="shDot dt2"></div>
      <div className="shDot dt3"></div>
      <div className="shLine l1"></div>
      <div className="shLine l2"></div>
      <svg className="shArc a1" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path d="M5 45 Q25 5 45 45" stroke="rgba(165, 220, 250, 0.27)" strokeWidth="1" fill="none" />
      </svg>
      <svg className="shArc a2" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M4 36 Q20 4 36 36" stroke="rgba(0, 183, 168, 0.2)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

export default Ambient;
