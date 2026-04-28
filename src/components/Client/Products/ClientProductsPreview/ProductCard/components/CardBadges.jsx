import React from 'react';
import styles from '../ProductCard.module.css';

const CardBadges = ({ t, is_trending, is_featured, discount }) => {
  return (
    <div className={`${styles.subCard} ${styles.topBar}`}>
      <span className={styles.categoryTag}>
        {is_trending
          ? t("product.trending")
          : is_featured
            ? t("product.featured")
            : t("product.new_arrival")}
      </span>
      {discount > 0 && (
        <span className={styles.discountBadge}>
          {t("product.discount")} {discount}%
        </span>
      )}
    </div>
  );
};

export default CardBadges;
