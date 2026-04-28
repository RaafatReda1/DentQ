import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import styles from "./Pixels.module.css";

const PIXELS = [
  {
    id: "meta",
    name: "Meta Pixel",
    color: "#1877F2",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png",
    placeholder: "Enter your Pixel ID",
    docsUrl: "https://www.facebook.com/business/help/952192354843755",
  },
  {
    id: "tiktok",
    name: "TikTok Pixel",
    color: "#010101",
    logo: "https://sf16-scmcdn-sg.ibytedtos.com/goofy/tiktok/web/node/_next/static/images/logo-white-f1f63e99b6f5ce3c4b04b714d19e0c0b.png",
    placeholder: "Enter your Pixel ID",
    docsUrl: "https://ads.tiktok.com/help/article?aid=10021",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    color: "#E37400",
    logo: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
    placeholder: "G-XXXXXXXXXX",
    docsUrl: "https://support.google.com/analytics/answer/9304153",
  },
];

const Pixels = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("admin.marketing.pixels.title", "Pixels & Analytics")}</h2>
        <p className={styles.sub}>{t("admin.marketing.pixels.subtitle", "Connect your tracking pixels to measure performance.")}</p>
      </div>

      <div className={styles.pixelGrid}>
        {PIXELS.map((pixel) => (
          <div key={pixel.id} className={styles.pixelCard}>
            <div className={styles.pixelHeader} style={{ borderLeftColor: pixel.color }}>
              <div className={styles.pixelLogo} style={{ background: pixel.color }}>
                <img src={pixel.logo} alt={pixel.name} className={styles.logoImg} />
              </div>
              <div>
                <p className={styles.pixelName}>{pixel.name}</p>
                <p className={styles.pixelStatus}>{t("admin.marketing.pixels.not_connected", "Not connected")}</p>
              </div>
              <a href={pixel.docsUrl} target="_blank" rel="noreferrer" className={styles.docsLink}>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className={styles.pixelInputRow}>
              <input
                className={styles.pixelInput}
                placeholder={pixel.placeholder}
                type="text"
              />
              <button className={styles.connectBtn}>
                {t("admin.marketing.pixels.connect", "Connect")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promo code conversion table */}
      <div className={styles.conversionSection}>
        <h3 className={styles.convTitle}>
          {t("admin.marketing.pixels.conversion_title", "Promo Code Conversion")}
        </h3>
        <p className={styles.convSub}>
          {t("admin.marketing.pixels.conversion_sub", "Track how each promo code is converting from orders data.")}
        </p>
        <div className={styles.comingSoon}>
          {t("admin.marketing.pixels.coming_soon", "📊 Analytics integration coming soon...")}
        </div>
      </div>
    </div>
  );
};

export default Pixels;
