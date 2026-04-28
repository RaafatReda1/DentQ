import React from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import styles from '../CartPage.module.css';

const EmptyCart = ({ t, navigate }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIconWrapper}>
        <ShoppingBag className={styles.emptyIcon} size={80} />
        <div className={styles.emptyIconDecor}></div>
      </div>
      <h2 className={styles.emptyTitle}>{t("cart.empty") || "Your cart is empty"}</h2>
      <p className={styles.emptySubtitle}>
        {t("cart.empty_description")}
      </p>
      <button className={styles.continueBtn} onClick={() => navigate('/')}>
        <Package size={20} />
        {t("cart.continue_shopping") || "Continue Shopping"}
      </button>
    </div>
  );
};

export default EmptyCart;