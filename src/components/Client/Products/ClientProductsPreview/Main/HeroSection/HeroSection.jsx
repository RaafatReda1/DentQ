import React, { useEffect, useState } from "react";
import fetchBanners from "./Actions";
import styles from "./HeroSection.module.css";
import { useTranslation } from "react-i18next";
function HeroSection({ slugName = "main" }) {
  const [banner, setBanner] = useState(null);
  const { i18n } = useTranslation();

  let bannerTitle;
  let bannerSubTitle;
  let bannerCTA;

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

  if (i18n.language === "en") {
    bannerTitle = banner?.title_en;
    bannerSubTitle = banner?.subtitle_en;
    bannerCTA = banner?.cta_text_en;
  } else {
    bannerTitle = banner?.title_ar;
    bannerSubTitle = banner?.subtitle_ar;
    bannerCTA = banner?.cta_text_ar;
  }

  return (
    <div
      className={styles.heroSection}
      style={
        !banner?.image
          ? { "--bg": `url(${banner?.image})` }
          : {
              background:`linear-gradient(
            135deg,
            ${banner?.bg_linear_colors?.[0] ?? '#0f2027'},
            ${banner?.bg_linear_colors?.[1] ?? '#203a43'},
            ${banner?.bg_linear_colors?.[2] ?? '#2c5364'}
          )`
            }
      }
    >
      <h2 className={styles.Title} style={{ color: banner?.title_color }}>
        {bannerTitle || ""}
      </h2>
      <h3 className={styles.subTitle} style={{ color: banner?.subtitle_color }}>
        {bannerSubTitle || ""}
      </h3>
      <a
        href={`#${banner?.cta_link}`}
        className={styles.ctaBtn}
        style={{
          "--cta-bg": banner?.cta_bg_color,
          color: banner?.cta_txt_color,
        }}
      >
        {bannerCTA || ""}
      </a>
    </div>
  );
}

export default HeroSection;
