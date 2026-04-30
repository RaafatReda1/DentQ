import React from "react";
import "./Intro.css";

const Intro = () => {
  return (
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
  );
};

export default Intro;
