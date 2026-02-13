import React, { useEffect, useState } from "react";
import fetchBanners from "./Actions";
import styles from "./HeroSection.module.css";
import { useTranslation } from "react-i18next";
function HeroSection({ slugName = "main" }) {
  const [banner, setBanner] = useState(null);
  const { t, i18n } = useTranslation();
  const loadBanner = async () => {
    const banners = await fetchBanners(slugName);
    if (banners && banners.length > 0) {
      setBanner(banners[0]);
    }
  };

  useEffect(() => {
    loadBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.heroSection}>
      <h2 className= {styles.Title}>
        {i18n.language === "en" ? banner?.title_en : banner?.title_ar || ""}
      </h2>
      <h3 className= {styles.subTitle}>
        {i18n.language === "en"
          ? banner?.subtitle_en
          : banner?.subtitle_ar || ""}
      </h3>
      <a href= {`#${banner?.cta_link}`} className= {styles.ctaBtn}>
        {i18n.language === "en"
          ? banner?.cta_text_en
          : banner?.cta_text_ar || ""}
      </a>
    </div>
  );
}

export default HeroSection;
