import React, { useState } from "react";
import styles from "./Header.module.css";
import Logo from "../Logo/Logo";
import SearchBar from "../SearchBar/SearchBar";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { Link } from "react-router-dom";
import Links from "../Links/Links";
import LangDropDown from "../LangDropDown/LangDropDown";
import MobileMenu from "../MobileMenu/MobileMenu";
const Header = () => {
  const [menuIsOpened, setMenuIsOpened] = useState(false);
  return (
    <div className={styles.Header}>
      <Logo />
      <SearchBar />
      <Links />{" "}
      {/*this is another component located in this dir and not a react router tag*/}
      <LangDropDown />
      <DropDownMenu />
      <MobileMenu
        menuIsOpened={menuIsOpened}
        setMenuIsOpened={setMenuIsOpened}
      />
    </div>
  );
};

export default Header;
