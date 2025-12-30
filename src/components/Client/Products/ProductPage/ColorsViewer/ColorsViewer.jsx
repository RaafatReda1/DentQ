import React from 'react';
import { useTranslation } from "react-i18next";
import styles from "./ColorsViewer.module.css";

function ColorsViewer({ product, selectedColor, setSelectedColor }) {
  const { t } = useTranslation();
  const colors = product?.colors;

  if (!colors || colors.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("product_page.colors")}</h3>
      <div className={styles.colorsGrid}>
        {colors.map((color, idx) => (
          <button
            key={idx}
            className={`${styles.colorOption} ${selectedColor === color ? styles.active : ""
              }`}
            style={{ backgroundColor: color }}
            title={color}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorsViewer;