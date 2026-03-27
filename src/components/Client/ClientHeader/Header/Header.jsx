import React, { useState, useEffect, useCallback } from "react";
import styles from "./Header.module.css";
import Logo from "../Logo/Logo";
import SearchBar from "../SearchBar/SearchBar";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import Links from "../Links/Links";
import LangDropDown from "../LangDropDown/LangDropDown";
import MobileMenu from "../MobileMenu/MobileMenu";

/**
 * Header Component
 * Handles sticky behavior, scroll effects, and responsive navigation.
 */
const Header = () => {
  const [menuIsOpened, setMenuIsOpened] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll to apply "shrink" or "glass" effect
  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const headerClasses = `${styles.Header} ${isScrolled ? styles.scrolled : ""}`;

  return (
    <header className={headerClasses}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Logo />
        </div>

        <div className={styles.centerSection}>
          <SearchBar />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.desktopNav}>
            <Links />
            <div className={styles.verticalDivider} />
            <LangDropDown />
            <DropDownMenu />
          </div>

          <MobileMenu
            menuIsOpened={menuIsOpened}
            setMenuIsOpened={setMenuIsOpened}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
