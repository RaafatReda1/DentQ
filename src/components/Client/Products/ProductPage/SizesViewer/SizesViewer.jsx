import React from 'react';
import styles from "./SizesViewer.module.css";

function SizesViewer({ product }) {
  const sizes = product?.sizes;

  if (!sizes || sizes.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Sizes</h3>
      <div className={styles.sizesGrid}>
        {sizes.map((size, idx) => (
          <div key={idx} className={styles.sizeOption}>
            {size}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SizesViewer;