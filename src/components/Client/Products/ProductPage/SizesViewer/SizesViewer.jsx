import React from 'react';
import { useTranslation } from "react-i18next";
import styles from "./SizesViewer.module.css";

function SizesViewer({ product, selectedSize, setSelectedSize }) {
  const { t } = useTranslation();
  const sizes = product?.sizes;

  if (!sizes || sizes.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t("product_page.sizes")}</h3>
      <div className={styles.sizesGrid}>
        {sizes.map((size, idx) => (
          <button
            key={idx}
            className={`${styles.sizeOption} ${selectedSize === size ? styles.active : ""
              }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizesViewer;