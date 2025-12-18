import React, { useState, useRef, useEffect, useContext } from "react";
import styles from "./DropDownMenu.module.css";
import { User, Package, LogOut, ChevronDown } from "lucide-react";
import { userContext } from "../../../../utils/AppContexts";
import { supabase } from "../../../../utils/SupabaseClient";
import { Login } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { SignInForm } from "../../../Auth/SignInForm/SignInForm";
import menuStyles from "../MobileMenu/MobileMenu.module.css";
import { useTranslation } from "react-i18next";

const DropDownMenu = ({ menuIsOpened }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const [user] = useContext(userContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (menuIsOpened) setOpen(true);
    else setOpen(false);
  }, [menuIsOpened]);
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

  //Handle userName that appears besides the img
  const handleUserName = () => {
    let userName = "";
    if (user.session) {
      const name = (user.nickName || user.fullName || "").trim(); // نختار أول متاح

      if (name.includes(" ")) {
        const firstName = name.split(" ")[0];
        userName =
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      } else {
        userName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      }

      if (userName.length > 20) {
        userName = userName.slice(0, 20) + "...";
      }
    } else {
      userName = t('menu.doctor');
    }
    return userName;
  };
  //Handle signOut
  const handleSignOut = async () => {
    if (!user.session) {
      console.warn("No active session found. Nothing to sign out from.");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      console.log("signOut!!");
      window.location.reload();
    }
  };
  return (
    <div className={menuIsOpened ? menuStyles.dropdown : styles.dropdown} ref={menuRef}>
      <button className={styles.profileButton} onClick={() => {
        if (menuIsOpened) return;
        setOpen(!open)
      }}>
        <img src="/vite.svg" alt="Profile" className={styles.profileImage} />

        {/* dispalying Doctor if no session and full name if session with no nick name and the nick name if session and nick name */}

        <span>
          {user.session && t('menu.dr')}
          {handleUserName()}
        </span>
        <ChevronDown
          className={`${styles.chevron} ${open ? styles.rotated : ""}`}
        />
      </button>

      {open && (
        <div className={styles.dropdownContent}>
          {user.session ? (
            <>
              <a href="/profile" className={styles.menuItem}>
                <User className={styles.menuIcon} />
                <span>{t('menu.my_profile')}</span>
              </a>
              <span
                className={`${styles.menuItem} ${styles.logoutItem}`}
                onClick={handleSignOut}
                style={{ cursor: "pointer" }}
              >
                <LogOut className={styles.menuIcon} />
                <span>{t('menu.logout')}</span>
              </span>
            </>
          ) : (
            <span style={{ textDecoration: "none", cursor: "pointer" }} className={`${styles.menuItem}`}>
              <Login className={styles.menuIcon} />
              <SignInForm /> {/*this is the signin component which includes login span as normal text which opens a popup inside the component once clicked */}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
