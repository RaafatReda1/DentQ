import React from "react";
import "./LoadingBar.css";

const LoadingBar = () => {
  return (
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
  );
};

export default LoadingBar;
