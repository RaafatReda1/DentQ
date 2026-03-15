import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchFooterData, getSocialIcon } from "./FooterActions";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isLTR = i18n.language.startsWith("en");

  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const getFooter = async () => {
      const data = await fetchFooterData("main");
      if (isMounted && data) {
        setFooterData(data);
      }
    };
    getFooter();
    return () => { isMounted = false; };
  }, []);

  // Parse links from the DB. Supabase returns JSONB arrays generally as standard arrays in JS.
  const socialLinks = footerData?.Links || [];
  const slogan = isLTR ? (footerData?.slogan_en || "") : (footerData?.slogan_ar || "");

  return (
    <footer className={styles.footer} dir={isLTR ? "ltr" : "rtl"}>
      <div className={styles.container}>
        <div className={styles.grid}>

          {/* Logo, Slogan and Socials Column */}
          <div className={`${styles.col} ${styles.logoCol}`}>
            {/* The brand logo mapping based on existing assets. Often just /logo.png */}
            <img
              src="/logo.png"
              alt="DentQ Logo"
              className={styles.logoImage}
              // Using an onerror fallback just in case logo isn't at root
              onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
            />
            {slogan && <p className={styles.slogan}>{slogan}</p>}

            {socialLinks.length > 0 && (
              <div className={styles.socials}>
                {socialLinks.map((linkObj, index) => {
                  const IconComponent = getSocialIcon(linkObj.url);
                  return (
                    <a
                      key={index}
                      href={linkObj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={linkObj.name}
                      className={styles.socialIcon}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shop By Column */}
          <div className={`${styles.col} ${styles.linkCol}`}>
            <h3>{t("footer.shop_by")}</h3>
            <ul>
              <li><Link to="/">{t("footer.all_products")}</Link></li>
              <li><Link to="/">{t("footer.all_categories")}</Link></li>
            </ul>
          </div>

          {/* Account Column */}
          <div className={`${styles.col} ${styles.linkCol}`}>
            <h3>{t("footer.account")}</h3>
            <ul>
              <li><Link to="/profile">{t("footer.my_account")}</Link></li>
              <li><Link to="/myorders">{t("footer.my_orders")}</Link></li>
              <li><Link to="/notifications">{t("footer.notifications")}</Link></li>
            </ul>
          </div>

          {/* Help & Info Column */}
          <div className={`${styles.col} ${styles.linkCol}`}>
            <h3>{t("footer.help_info")}</h3>
            <ul>
              <li><Link to="/contact">{t("footer.contact_us")}</Link></li>
              <li><Link to="/about">{t("footer.about_us")}</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Rights & Legal */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} {t("footer.all_rights_reserved")}
          </div>
          <div className={styles.bottomLinks}>
            <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className={styles.bottomLink}>{t("footer.terms_of_use")}</Link>
            <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className={styles.bottomLink}>{t("footer.privacy_policy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;