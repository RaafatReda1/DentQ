import React, { useEffect } from 'react';
import { Drawer, IconButton, Box } from "@mui/material";
import { Menu, X } from "lucide-react";
import styles from "./MobileMenu.module.css";
import { useTranslation } from "react-i18next";

// Import existing components
import Links from "../Links/Links";
import LangDropDown from "../LangDropDown/LangDropDown";
import DropDownMenu from "../DropDownMenu/DropDownMenu";

/**
 * MobileMenu Component
 * Handles the mobile navigation drawer and body overflow locking.
 */
const MobileMenu = ({ menuIsOpened, setMenuIsOpened }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl' || i18n.language.startsWith('ar');

  // Lock body scroll when menu is open to prevent background scrolling
  useEffect(() => {
    if (menuIsOpened) {
      document.body.classList.add('lock-scroll');
    } else {
      document.body.classList.remove('lock-scroll');
    }

    // Cleanup on unmount
    return () => document.body.classList.remove('lock-scroll');
  }, [menuIsOpened]);

  const closeMenu = () => setMenuIsOpened(false);

  return (
    <>
      <div className={styles.mobileTrigger}>
        <IconButton
          onClick={() => setMenuIsOpened(true)}
          className={styles.triggerButton}
          aria-label={t('menu.open_menu')}
        >
          <Menu size={28} />
        </IconButton>
      </div>

      <Drawer
        open={menuIsOpened}
        onClose={closeMenu}
        anchor={isRTL ? 'right' : 'left'}
        className={styles.drawer}
        PaperProps={{
          sx: {
            width: "85%",
            maxWidth: "360px",
            background: "var(--background-light)",
            borderLeft: isRTL ? "none" : "1px solid var(--border-color)",
            borderRight: isRTL ? "1px solid var(--border-color)" : "none",
            overflowX: "hidden", // Prevent horizontal bleed
            overflowY: "auto",   // Ensure vertical scroll works
            display: "flex",
            flexDirection: "column"
          },
        }}
      >
        <Box
          className={styles.drawerContainer}
          role="presentation"
          sx={{ overflowX: "hidden", width: "100%" }}
        >
          {/* Header with Close Button */}
          <div className={styles.drawerHeader}>
            <div className={styles.titleWrapper}>
              <span className={styles.drawerTitle}>{t('menu.menu')}</span>
              <div className={styles.titleUnderline} />
            </div>
            <IconButton
              onClick={closeMenu}
              className={styles.closeButton}
              aria-label={t('menu.close_menu')}
            >
              <X size={24} />
            </IconButton>
          </div>

          <div className={styles.scrollContent}>
            {/* Links Section */}
            <div className={styles.navSection}>
              <Links menuIsOpened={true} />
            </div>

            <div className={styles.divider} />

            {/* Actions Section: Language & Profile */}
            <div className={styles.actionsSection}>
              <div className={styles.actionItem}>
                <span className={styles.sectionLabel}>{t('menu.language')}</span>
                <LangDropDown menuIsOpened={true} />
              </div>

              <div className={styles.actionItem}>
                <span className={styles.sectionLabel}>{t('menu.user_menu') || "Account"}</span>
                <DropDownMenu menuIsOpened={true} />
              </div>
            </div>
          </div>

          <div className={styles.drawerFooter}>
            <p className={styles.footerText}>DentQ &copy; 2025</p>
          </div>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileMenu;
