import React from "react";
import styles from "../BannerEditor.module.css";

const EditorPreview = ({ form, lang, tp, heroStyle }) => {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeaderRow}>
        <div className={styles.previewLabel}>{tp("live_preview", "LIVE PREVIEW")}</div>
        <div className={styles.liveBadge}>
          <div className={styles.pulse} /> {tp("online", "ONLINE")}
        </div>
      </div>
      <div className={styles.heroSection} style={heroStyle} dir={lang === 'en' ? 'ltr' : 'rtl'}>
        <div className={styles.overlay}></div>
        <div className={styles.contentWrapper}>
          <h2 className={styles.Title} style={{ color: form.title_color || '#ffffff' }}>
            {form[`title_${lang === 'en' ? 'en' : 'ar'}`] || "Banner Title"}
          </h2>
          {form[`subtitle_${lang === 'en' ? 'en' : 'ar'}`] && (
            <h3 className={styles.subTitle} style={{ color: form.subtitle_color || '#e2e8f0' }}>
              {form[`subtitle_${lang === 'en' ? 'en' : 'ar'}`]}
            </h3>
          )}
          {form[`cta_text_${lang === 'en' ? 'en' : 'ar'}`] && (
            <div className={styles.ctaBtn}>{form[`cta_text_${lang === 'en' ? 'en' : 'ar'}`]}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPreview;
