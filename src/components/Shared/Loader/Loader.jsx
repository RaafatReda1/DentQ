import React from "react";
import "./Loader.css";
import Ambient from "./components/Ambient/Ambient";
import Intro from "./components/Intro/Intro";
import LoadingBar from "./components/LoadingBar/LoadingBar";
import Outro from "./components/Outro/Outro";

const Loader = ({ theme = "light" }) => {
  return (
    <div className={`loaderOverlay ${theme === "dark" ? "dark" : ""}`}>
      <Ambient />
      <Intro />
      <LoadingBar />
      <Outro />
    </div>
  );
};

export default Loader;
