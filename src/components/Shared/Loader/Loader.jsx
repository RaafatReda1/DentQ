import React from "react";
import "./Loader.css";

const Loader = ({ theme = "light" }) => {
  return (
    <div className={`loaderOverlay ${theme === "dark" ? "dark" : ""}`}>
      {/* Ambient Shapes */}
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

      {/* Phase 1: Intro */}
      <div className="phIntro">
        <div className="wordmark">
          <span className="wl w1">D</span>
          <span className="wl w2">e</span>
          <span className="wl w3">n</span>
          <span className="wl w4">t</span>
          <div className="qWrap">
            <span className="qLetter qExit">Q</span>
            <svg className="toothSvg" width="69" height="99" viewBox="0 0 46 66" fill="none">
              <path
                d="M23 3C12 3 5 11 5 21C5 30 7 40 11 49C14 56 18 61 21 61C22.5 61 23 56 23 50C23 56 23.5 61 25 61C28 61 32 56 35 49C39 40 41 30 41 21C41 11 34 3 23 3Z"
                fill="#00b7a8" />
              <ellipse cx="17.5" cy="14" rx="3.5" ry="5.5" fill="white" opacity=".22" />
              <path d="M23 3C12 3 5 11 5 21" stroke="#007a72" strokeWidth="1.2" fill="none" opacity=".4" />
            </svg>
          </div>
        </div>
        <div className="rule"></div>
        <div className="tagline">dental &amp; medical supplies</div>
      </div>

      {/* Phase 2: Loading Bar */}
      <div className="phLoad">
        <div className="loadShapes">
          <div className="lsOrbit"></div>
          <div className="lsCross"></div>
          <div className="lsDots">
            <div className="lsD"></div>
            <div className="lsD"></div>
            <div className="lsD"></div>
          </div>
          <svg className="lsToothWrap" width="18" height="26" viewBox="0 0 22 30" fill="none">
            <path
              d="M11 2C6 2 2 6 2 11C2 16 3 20 5 25C7 28 9 30 11 30C12 30 12.5 27 11 24C9.5 27 10 30 11 30C13 30 15 28 17 25C19 20 20 16 20 11C20 6 16 2 11 2Z"
              fill="#00b7a8" opacity=".8" />
          </svg>
          <div className="lsDiamond"></div>
        </div>
        <div className="loadTrack">
          <div className="loadFill"></div>
        </div>
        <div className="loadLabel">loading your supplies</div>
      </div>

      {/* Phase 3: Outro */}
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
    </div>
  );
};

export default Loader;
