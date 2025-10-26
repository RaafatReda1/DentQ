import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import { Link, useLocation } from "react-router-dom";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import SearchBar from "../SearchBar/SearchBar";
import {
  BriefcaseMedical,
  ListOrdered,
  Bell,
  ShoppingCart,
  Globe,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const location = useLocation();
  const langDropdownRef = useRef(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };

  const handleLangChange = (lang) => {
    setSelectedLang(lang);
    setIsLangDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <Link to={"/"} className={styles.logoLink} aria-label="DentQ Home">
            <img src="/logo.png" alt="DentQ Logo" className={styles.logo} />
          </Link>
        </div>

        {/* Search Bar - Desktop & Tablet */}
        {!isMobileMenuOpen && (
          <div className={styles.searchSection}>
          <SearchBar />
        </div>
        )}

        {/* Navigation Links - Desktop */}
        <nav className={styles.desktopNav}>
          <Link
            to={"/ourproducts"}
            className={`${styles.navLink} ${
              isActive("/ourproducts") ? styles.active : ""
            }`}
            aria-label="Our Products"
          >
            <span className={styles.icon}>
              <BriefcaseMedical />
            </span>
            <span className={styles.linkText}>Products</span>
          </Link>

          <Link
            to={"/myorders"}
            className={`${styles.navLink} ${
              isActive("/myorders") ? styles.active : ""
            }`}
            aria-label="My Orders"
          >
            <span className={styles.icon}>
              <ListOrdered />
            </span>
            <span className={styles.linkText}>Orders</span>
          </Link>

          <Link
            to={"/notifications"}
            className={`${styles.navLink} ${
              isActive("/notifications") ? styles.active : ""
            }`}
            aria-label="Notifications"
          >
            <span className={styles.icon}>
              <Bell />
            </span>
            <span className={styles.linkText}>Notifications</span>
            <span className={styles.notificationBadge}>3</span>
          </Link>

          <Link
            to={"/cart"}
            className={`${styles.navLink} ${styles.cartLink} ${
              isActive("/cart") ? styles.active : ""
            }`}
            aria-label="Shopping Cart"
          >
            <span className={styles.icon}>
              <ShoppingCart />
            </span>
            <span className={styles.linkText}>Cart</span>
            <span className={styles.cartBadge}>5</span>
          </Link>
        </nav>

        {/* Right Section - Language & Profile */}
        <div className={styles.rightSection}>
          <div className={styles.langSelector} ref={langDropdownRef}>
            <button
              className={styles.langButton}
              onClick={toggleLangDropdown}
              aria-label="Select Language"
            >
              <Globe className={styles.langIcon} />
              <span>{selectedLang === "en" ? "English" : "عربي"}</span>
              <ChevronDown
                className={`${styles.chevronIcon} ${
                  isLangDropdownOpen ? styles.rotated : ""
                }`}
              />
            </button>
            {isLangDropdownOpen && (
              <div className={styles.langDropdown}>
                <button
                  className={styles.langOption}
                  onClick={() => handleLangChange("en")}
                >
                  <span className={styles.langFlag}>🇬🇧</span>
                  <span>English</span>
                </button>
                <button
                  className={styles.langOption}
                  onClick={() => handleLangChange("ar")}
                >
                  <span className={styles.langFlag}>🇸🇦</span>
                  <span>عربي</span>
                </button>
              </div>
            )}
          </div>

          <div className={styles.profileMenu}>
            <DropDownMenu />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`${styles.mobileNav} ${
          isMobileMenuOpen ? styles.mobileNavOpen : ""
        }`}
      >
        <div className={styles.mobileSearchSection}>
          <SearchBar />
        </div>

        <nav className={styles.mobileNavLinks}>
          <Link
            to={"/ourproducts"}
            className={`${styles.mobileNavLink} ${
              isActive("/ourproducts") ? styles.active : ""
            }`}
            onClick={toggleMobileMenu}
          >
            <span className={styles.icon}>
              <BriefcaseMedical />
            </span>
            <span>Products</span>
          </Link>

          <Link
            to={"/myorders"}
            className={`${styles.mobileNavLink} ${
              isActive("/myorders") ? styles.active : ""
            }`}
            onClick={toggleMobileMenu}
          >
            <span className={styles.icon}>
              <ListOrdered />
            </span>
            <span>Orders</span>
          </Link>

          <Link
            to={"/notifications"}
            className={`${styles.mobileNavLink} ${
              isActive("/notifications") ? styles.active : ""
            }`}
            onClick={toggleMobileMenu}
          >
            <span className={styles.icon}>
              <Bell />
            </span>
            <span>Notifications</span>
            <span className={styles.notificationBadge}>3</span>
          </Link>

          <Link
            to={"/cart"}
            className={`${styles.mobileNavLink} ${
              isActive("/cart") ? styles.active : ""
            }`}
            onClick={toggleMobileMenu}
          >
            <span className={styles.icon}>
              <ShoppingCart />
            </span>
            <span>Cart</span>
            <span className={styles.cartBadge}>5</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;
