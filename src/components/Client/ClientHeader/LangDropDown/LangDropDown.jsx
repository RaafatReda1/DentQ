import React, { useEffect, useState } from "react";
import menuStyles from "../MobileMenu/MobileMenu.module.css";
import styles from "./LangDropDown.module.css";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";

const LangDropDown = ({ menuIsOpened }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");
  
  useEffect(() => {
    setCurrentLang(i18n.language);
    // Ensure direction is set on mount/change
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div
      className={`${styles.dropdownContainer} ${
        menuIsOpened
          ? menuStyles.mobileLangDropDown
          : styles.desktopLangDropDown
      }`}
    >
      {/* Trigger Button */}
      <button className={styles.triggerButton} aria-label="Select Language">
        <Globe size={18} className={styles.iconGlobe} />
        {/* Simple Label based on current Lang */}
        <span>{currentLang === "en" ? "English" : "العربية"}</span>
        <ChevronDown size={14} className={styles.iconChevron} />
      </button>

      {/* Dropdown Menu */}
      <div className={styles.dropdownMenu}>
        <button
          className={`${styles.menuItem} ${
            currentLang === "en" ? styles.active : ""
          }`}
          onClick={() => changeLanguage("en")}
        >
          <span>
            <span className={styles.flag}>🇺🇸</span> English
          </span>
          {currentLang === "en" && <Check size={14} />}
        </button>

        <button
          className={`${styles.menuItem} ${
            currentLang === "ar" ? styles.active : ""
          }`}
          onClick={() => changeLanguage("ar")}
        >
          <span>
            <span className={styles.flag}>🇪🇬</span> العربية
          </span>
          {currentLang === "ar" && <Check size={14} />}
        </button>
      </div>
    </div>
  );
};

export default LangDropDown;
