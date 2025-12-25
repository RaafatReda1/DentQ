import React from 'react';
import { Drawer, IconButton } from "@mui/material";
import { Menu, X } from "lucide-react";
import styles from "./MobileMenu.module.css";
import { useTranslation } from "react-i18next";

// Import existing components
import Links from "../Links/Links";
import LangDropDown from "../LangDropDown/LangDropDown";
import DropDownMenu from "../DropDownMenu/DropDownMenu";

const MobileMenu = ({ menuIsOpened, setMenuIsOpened }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      {/* SearchBar is now in Header, so we only need the Menu Trigger here */}
      <div className={styles.mobileTrigger}>
        <IconButton
          onClick={() => setMenuIsOpened(true)}
          color="inherit"
          aria-label={t('menu.open_menu')}
          size="medium"
        >
          <Menu size={28} />
        </IconButton>
      </div>

      <Drawer
        open={menuIsOpened}
        onClose={() => setMenuIsOpened(false)}
        anchor={i18n.dir() === 'rtl' || i18n.language.startsWith('ar') ? 'right' : 'left'}
        PaperProps={{
          sx: { width: "85%", maxWidth: "350px" },
          className: styles.drawerPaper // Use class for RTL support if needed
        }}
      >
        <div className={styles.mobileMenu}>
          {/* Header with Close Button */}
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>{t('menu.menu')}</span>
            <IconButton onClick={() => setMenuIsOpened(false)} aria-label={t('menu.close_menu')}>
              <X size={24} />
            </IconButton>
          </div>

          {/* Links Section */}
          <div className={styles.linksSection}>
            {/* Pass menuIsOpened prop to adapt styles if needed */}
            <Links menuIsOpened={true} />
          </div>

          <div className={styles.divider} />

          {/* Footer Actions: Language & Profile */}
          <div className={styles.footerSection}>
            <div className={styles.langWrapper}>
              <span className={styles.sectionLabel}>{t('menu.language')}</span>
              <LangDropDown menuIsOpened={true} />
            </div>

            <div className={styles.profileWrapper}>
              <DropDownMenu menuIsOpened={true} />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileMenu;
