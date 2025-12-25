import React, { useState, useEffect } from "react";
import styles from "./ImgsViewer.module.css";

const ImgsViewer = ({ product }) => {
  const images = product?.images || [];
  const [selectedImg, setSelectedImg] = useState(images[0] || "");

  // Update selected image if product changes
  useEffect(() => {
    if (images.length > 0) setSelectedImg(images[0]);
  }, [product]);

  if (images.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.mainImgContainer}>
        <img src={selectedImg} alt={product.nameEn} className={styles.mainImg} />
      </div>
      <div className={styles.thumbnails}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`${styles.thumbnail} ${selectedImg === img ? styles.selected : ""}`}
            onClick={() => setSelectedImg(img)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImgsViewer;