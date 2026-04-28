import React from 'react';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import styles from '../ProductCard.module.css';

const CardOverlay = ({ t, isAdded, onAddToCart, onViewDetails }) => {
  return (
    <div className={styles.overlay}>
      <button
        className={`${styles.actionButton} ${isAdded ? styles.added : ""}`}
        aria-label={t("product.add_to_cart")}
        onClick={onAddToCart}
      >
        {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
      </button>
      <button
        className={styles.actionButton}
        aria-label={t("product.view_details")}
        onClick={onViewDetails}
      >
        <Eye size={20} />
      </button>
    </div>
  );
};

export default CardOverlay;
