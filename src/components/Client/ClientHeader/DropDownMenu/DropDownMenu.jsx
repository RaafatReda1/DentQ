import React, { useState, useRef, useEffect } from "react";
import styles from "./DropDownMenu.module.css";
import { User, Package, LogOut, ChevronDown } from "lucide-react";

const DropDownMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.dropdown} ref={menuRef}>
      <button className={styles.profileButton} onClick={() => setOpen(!open)}>
        <img src="/vite.svg" alt="Profile" className={styles.profileImage} />
        <ChevronDown
          className={`${styles.chevron} ${open ? styles.rotated : ""}`}
        />
      </button>

      {open && (
        <div className={styles.dropdownContent}>
          <a href="/profile" className={styles.menuItem}>
            <User className={styles.menuIcon} />
            <span>My Profile</span>
          </a>
          <a href="/orders" className={styles.menuItem}>
            <Package className={styles.menuIcon} />
            <span>My Orders</span>
          </a>
          <a
            href="/logout"
            className={`${styles.menuItem} ${styles.logoutItem}`}
          >
            <LogOut className={styles.menuIcon} />
            <span>Logout</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
