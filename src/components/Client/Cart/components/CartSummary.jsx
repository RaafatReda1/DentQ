import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import styles from '../CartPage.module.css';

const CartSummary = ({ t, totalItems, totalPrice, formatPrice, navigate }) => {
  return (
    <div className={styles.summaryWrapper}>
      <div className={styles.summarySection}>
        <div className={styles.summaryHeader}>
          <Sparkles size={20} className={styles.sparkleIcon} />
          <h3 className={styles.summaryTitle}>{t("cart.order_summary")}</h3>
        </div>

        <div className={styles.summaryDetails}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>{t("cart.subtotal")} ({totalItems} {t("cart.items")})</span>
            <span className={styles.summaryValue}>{formatPrice(totalPrice)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>{t("cart.shipping")}</span>
            <span className={styles.summaryValueFree}>{t("cart.calculated_at_checkout")}</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>{t("cart.total") || "Total"}</span>
            <span className={styles.totalValue}>{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
          <span>{t("cart.checkout") || "Proceed to Checkout"}</span>
          <ArrowLeft size={20} className={styles.checkoutArrow} />
        </button>

        <button className={styles.continueShoppingBtn} onClick={() => navigate('/')}>
          {t("cart.continue_shopping") || "Continue Shopping"}
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
