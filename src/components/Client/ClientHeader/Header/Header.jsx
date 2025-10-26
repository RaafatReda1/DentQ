import React from "react";
import styles from "./Header.module.css";
import Logo from "../Logo/Logo";
import SearchBar from "../SearchBar/SearchBar";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { Link } from "react-router-dom";
import Links from "../Links/Links";
import LangDropDown from "../LangDropDown/LangDropDown";
const Header = () => {
  return (
    <div className={styles.Header}>
      <Logo />
      <SearchBar />
      <Links/> {/*this is another component located in this dir and not a react router tag*/}
      <LangDropDown/>
      <DropDownMenu />
    </div>
  );
};

export default Header;
