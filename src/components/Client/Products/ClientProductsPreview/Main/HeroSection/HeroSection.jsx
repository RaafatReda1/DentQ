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

  const link = banner?.cta_link || "category/" + banner?.related_cat_id ;

  const heroStyle = banner.image
    ? { "--bg": `url(${banner.image})` }
    : {
        background: `linear-gradient(
          135deg,
          ${banner?.bg_linear_colors?.[0] ?? "#0f2027"},
          ${banner?.bg_linear_colors?.[1] ?? "#203a43"},
          ${banner?.bg_linear_colors?.[2] ?? "#2c5364"}
        )`,
      };

  return (
    <div className={styles.heroSection} style={heroStyle}>
      <h2 className={styles.Title} style={{ color: banner.title_color }}>
        {bannerTitle}
      </h2>

      <h3 className={styles.subTitle} style={{ color: banner.subtitle_color }}>
        {bannerSubTitle}
      </h3>

      <a
        href={`#${link}`}
        className={styles.ctaBtn}
        style={{
          "--cta-bg": banner?.cta_bg_color || "#ffffff",
          color: banner?.cta_txt_color || "#000",
        }}
      >
        {bannerCTA}
      </a>
    </div>
  );
}

export default HeroSection;
