import React from "react";
import styles from "./Totals.module.css";
const Totals = () => {
  return (
    <section className={styles.totalsSection}>
      <h2 className= {styles.header}>Total</h2>

      <div className={`${styles.PriceBfDiscount} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>Total Price</h2>
        <span className={styles.sectionSpan}>1000 EGP</span>
      </div>

      <div className={`${styles.Shipping} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>Shipping</h2>
        <span className={styles.sectionSpan}>50 EGP</span>
      </div>

      <div className={`${styles.Discount} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>Discount</h2>
        <span className={styles.sectionSpan}>-100 EGP</span>
      </div>

      <div className={`${styles.promoDiscount} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>Promo Discount</h2>
        <span className={styles.sectionSpan}>-50 EGP</span>
      </div>

      <div className={`${styles.Total} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>Total</h2>
        <span className={styles.sectionSpan}>900 EGP</span>
      </div>
    </section>
  );
};

export default Totals;
