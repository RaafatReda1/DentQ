import React from "react";
import "./Outro.css";

const Outro = () => {
  return (
    <div className="phOutro" style={{ position: "relative" }}>
      <div className="outroTrail"></div>
      <div className="outroSub">ready</div>
      <div className="outroBrand">
        <span className="obLetter">D</span>
        <span className="obLetter">e</span>
        <span className="obLetter">n</span>
        <span className="obLetter">t</span>
        <svg className="obTooth" width="57" height="81" viewBox="0 0 40 56" fill="none">
          <path
            d="M20 2C11 2 4 9 4 18C4 26 6 35 9 43C12 49 15 53 18 53C19.5 53 20 49 20 44C20 49 20.5 53 22 53C25 53 28 49 31 43C34 35 36 26 36 18C36 9 29 2 20 2Z"
            fill="#00b7a8" />
          <ellipse cx="15.5" cy="12" rx="3" ry="4.5" fill="white" opacity=".22" />
        </svg>
      </div>
    </div>
  );
};

export default Outro;
