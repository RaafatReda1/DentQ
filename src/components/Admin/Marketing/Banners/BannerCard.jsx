import React from "react";
import styles from "./BannerCard.module.css";

const BannerCard = ({ banner, isSelected, onSelect, onToggleActive }) => {
  const colors = Array.isArray(banner.bg_linear_colors) ? banner.bg_linear_colors : ["#1e293b", "#334155"];
  const gradient = `linear-gradient(135deg, ${colors.join(", ")})`;
  const background = banner.image ? `url(${banner.image})` : gradient;

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      {/* Color/Image preview swatch */}
      <div className={styles.swatch} style={{ background: background, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      {/* Text */}
      <div className={styles.info}>
        <p className={styles.name}>{banner.title_en || "Untitled Banner"}</p>
        {banner.subtitle_en && (
          <p className={styles.sub}>{banner.subtitle_en}</p>
        )}
      </div>

      {/* Toggle */}
      <label
        className={styles.toggle}
        onClick={(e) => { e.stopPropagation(); onToggleActive(); }}
        title={banner.is_active ? "Deactivate" : "Activate"}
      >
        <input type="checkbox" checked={banner.is_active} onChange={() => {}} />
        <span className={styles.slider} />
      </label>
    </div>
  );
};

export default BannerCard;
