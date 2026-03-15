import React from 'react';
import styles from "./HeroSection.module.css";
import { useTranslation } from "react-i18next";

function HeroSection({ Banner }) {
  const { i18n } = useTranslation();
  const banner = Banner;

  if (!banner) return null;

  const lang = i18n.language.startsWith("en") ? "en" : "ar";

  const bannerTitle = banner[`title_${lang}`] ?? "";
  const bannerSubTitle = banner[`subtitle_${lang}`] ?? "";
  const bannerCTA = banner[`cta_text_${lang}`] ?? "";

  const link = banner?.cta_link || "category/" + banner?.related_cat_id;

  // Process linear colors safely
  let gradientColors = ["#0f2027", "#203a43", "#2c5364"]; // Default
  if (banner?.bg_linear_colors && Array.isArray(banner.bg_linear_colors)) {
    if (banner.bg_linear_colors.length >= 2) {
      gradientColors = banner.bg_linear_colors;
    }
  }

  // Construct Background Style
  const backgroundStyle = banner.image
    ? { backgroundImage: `url(${banner.image})` }
    : { backgroundImage: `linear-gradient(135deg, ${gradientColors.join(', ')})` };

  const heroStyle = {
    ...backgroundStyle,
    '--cta-bg': banner?.cta_bg_color || "#14b8a6",
    '--cta-txt': banner?.cta_txt_color || "#ffffff",
  };

  return (
    <div className={styles.heroSection} style={heroStyle} dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className={styles.overlay}></div>
      <div className={styles.contentWrapper}>
        <h2 className={styles.Title} style={{ color: banner?.title_color || '#ffffff' }}>
          {bannerTitle}
        </h2>

        {bannerSubTitle && (
          <h3 className={styles.subTitle} style={{ color: banner?.subtitle_color || '#e2e8f0' }}>
            {bannerSubTitle}
          </h3>
        )}

        {bannerCTA && (
          <a
            href={`#${link}`}
            className={styles.ctaBtn}
          >
            {bannerCTA}
          </a>
        )}
      </div>
    </div>
  );
}

export default HeroSection;
