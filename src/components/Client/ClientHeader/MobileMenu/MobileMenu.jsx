import React from 'react';
import { Drawer, IconButton } from "@mui/material";
import { Menu, X } from "lucide-react";
import styles from "./MobileMenu.module.css";

// Import existing components
import Links from "../Links/Links";
import SearchBar from "../SearchBar/SearchBar";
import LangDropDown from "../LangDropDown/LangDropDown";
import DropDownMenu from "../DropDownMenu/DropDownMenu"; // User Profile logic

const MobileMenu = ({ menuIsOpened, setMenuIsOpened }) => {
  return (
    <>
      {/* Hamburger Icon - Only visible on mobile via CSS media queries */}
      <div className={styles.mobileTrigger}>
        <IconButton
          onClick={() => setMenuIsOpened(true)}
          color="inherit" // Inherit white from header usually
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </IconButton>
      </div>

      <Drawer
        open={menuIsOpened}
        onClose={() => setMenuIsOpened(false)}
        anchor="left" // Side drawer
        PaperProps={{
          sx: { width: "80%", maxWidth: "300px" },
        }}
      >
        <div className={styles.mobileMenu}>
          {/* Header with Close Button */}
          <div className={styles.drawerHeader}>
            <IconButton onClick={() => setMenuIsOpened(false)} aria-label="Close Menu">
              <X size={24} />
            </IconButton>
          </div>

          {/* Search Bar Section */}
          <div className={styles.section}>
            <div className={styles.mobileSearchWrapper}>
              {/* Pass mobile prop if SearchBar supports it to adjust width */}
              <SearchBar menuIsOpened={true} />
            </div>
          </div>

          {/* Navigation Links */}
          {/* We wrap Links in a div to potentially override styles if Links component allows or via parent selector */}
          <div className={styles.linksSection}>
            <Links menuIsOpened={true} />
          </div>

          <div className={styles.divider} />

          {/* Language Switcher */}
          <div className={styles.section}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Language</span>
            <div className={styles.mobileLangWrapper}>
              <LangDropDown menuIsOpened={true} />
            </div>
          </div>

          {/* User Profile / Login (Bottom) */}
          <div className={styles.profileSection}>
            <DropDownMenu menuIsOpened={true} />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileMenu;
