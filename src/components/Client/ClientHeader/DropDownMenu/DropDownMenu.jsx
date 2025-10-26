import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "./DropDownMenu.module.css";
import { User, Package, LogOut, ChevronDown } from "lucide-react";
import { userContext } from "../../../../utils/AppContexts";

const DropDownMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const [user] = useContext(userContext);

  console.log(user)
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

        {/* dispalying Doctor if no session and full name if session with no nick name and the nick name if session and nick name */}
        {user.session? (
          user.nickName? (<span>Dr.{user.nickName}</span>): (<span>Dr.{user.fullName}</span>)
        ): 
          <span>Doctor</span>
        }
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
