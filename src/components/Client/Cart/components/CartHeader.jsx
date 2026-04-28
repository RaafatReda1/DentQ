import React from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import styles from '../CartPage.module.css';

const CartHeader = ({ t, navigate, loading, cartItems, totalItems }) => {
  return (
    <div className={styles.headerSection}>
      <div className={styles.headerContent}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>{t("product_page.back") || "Back"}</span>
        </button>

        <div className={styles.titleWrapper}>
          <div className={styles.iconWrapper}>
            <ShoppingCart className={styles.cartIcon} size={32} />
            {!loading && cartItems.length > 0 && (
              <span className={styles.itemBadge}>{totalItems}</span>
            )}
          </div>
          <div>
            <h1 className={styles.title}>{t("cart.title") || "My Cart"}</h1>
            {!loading && cartItems.length > 0 && (
              <p className={styles.subtitle}>
                {totalItems} {totalItems === 1 ? t("cart.item") : t("cart.items")} {t("cart.in_your_cart")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartHeader;
