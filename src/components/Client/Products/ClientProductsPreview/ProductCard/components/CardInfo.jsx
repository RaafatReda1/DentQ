import React from 'react';
import { Star } from 'lucide-react';
import styles from '../ProductCard.module.css';
import RenderProductNameOrDesc from '../../../../../../utils/RenderProductNameOrDesc';

const CardInfo = ({ product, i18n, rating, price, original_price, formatPrice }) => {
  const name = RenderProductNameOrDesc(product, "name", i18n.language);
  const desc = RenderProductNameOrDesc(product, "desc", i18n.language);

  return (
    <div className={styles.productInfo}>
      <h3 className={styles.productTitle}>{name}</h3>

      <div className={styles.ratingRow}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.round(rating || 0)
                ? styles.starFilled
                : styles.starEmpty
            }
            fill={i < Math.round(rating || 0) ? "currentColor" : "none"}
          />
        ))}
        <span className={styles.ratingValue}>({rating || 0})</span>
      </div>

      <p className={styles.productDescription}>
        {desc?.substring(0, 60)}
        {desc?.length > 60 ? "..." : ""}
      </p>

      <div className={styles.priceRow}>
        <span className={styles.currentPrice}>{formatPrice(price)}</span>
        {original_price > price && (
          <span className={styles.originalPrice}>
            {formatPrice(original_price)}
          </span>
        )}
      </div>
    </div>
  );
};

export default CardInfo;
