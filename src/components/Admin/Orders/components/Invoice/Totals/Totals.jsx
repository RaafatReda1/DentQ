import React from "react";
import styles from "./Totals.module.css";
import { useTranslation } from "react-i18next";

const Totals = ({ order }) => {
  const { t } = useTranslation();

  const shipping = Number(order?.GovernoratesShipping?.shippingPrice || 0);
  const finalTotal = Number(order?.total_amount || 0);
  
  // Compute true raw cost (original price) and discounted price
  let rawSubTotal = 0;
  let discountedSubTotal = 0;

  order?.Order_items?.forEach((item) => {
    const qty = Number(item.quantity) || 1;
    // Fallback to price if original_price is missing or zero
    const originalUnitPrice = Number(item.Products?.original_price) > 0 
      ? Number(item.Products?.original_price) 
      : Number(item.price);
    
    rawSubTotal += originalUnitPrice * qty;
    discountedSubTotal += Number(item.price) * qty;
  });

  // 1. Direct Product Discounts (Original sum - Discounted sum)
  const productDiscounts = rawSubTotal - discountedSubTotal;

  // 2. Extra Promo Code Discount
  // The cart total should theoretically be: discountedSubTotal + shipping. 
  // Any amount lower than that in the database 'total_amount' is an arbitrary promo code!
  const computedTotal = discountedSubTotal + shipping;
  const promoDiscount = computedTotal > finalTotal ? computedTotal - finalTotal : 0;

  return (
    <section className={styles.totalsSection}>
      <h2 className={styles.header}>{t("admin.orders.invoice.total", "Total")}</h2>

      <div className={`${styles.PriceBfDiscount} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>{t("admin.orders.invoice.subtotal", "Sub Total")}</h2>
        <span className={styles.sectionSpan}>{rawSubTotal.toLocaleString()} EGP</span>
      </div>

      <div className={`${styles.Shipping} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>{t("admin.orders.invoice.shipping", "Shipping")}</h2>
        <span className={styles.sectionSpan}>{shipping > 0 ? `${shipping.toLocaleString()} EGP` : t("admin.orders.invoice.free", "Free")}</span>
      </div>

      {productDiscounts > 0 && (
        <div className={`${styles.Discount} ${styles.sectionFeild}`}>
          <h2 className={styles.sectionHeader}>{t("admin.orders.invoice.product_discount", "Items Discount")}</h2>
          <span className={styles.sectionSpan}>-{productDiscounts.toLocaleString()} EGP</span>
        </div>
      )}

      {promoDiscount > 0 && (
        <div className={`${styles.promoDiscount} ${styles.sectionFeild}`}>
          <h2 className={styles.sectionHeader}>{t("admin.orders.invoice.promo_discount", "Promo Discount")}</h2>
          <span className={styles.sectionSpan}>-{promoDiscount.toLocaleString()} EGP</span>
        </div>
      )}

      <div className={`${styles.Total} ${styles.sectionFeild}`}>
        <h2 className={styles.sectionHeader}>{t("admin.orders.invoice.final_total", "Net Total")}</h2>
        <span className={styles.sectionSpan}>{finalTotal.toLocaleString()} EGP</span>
      </div>
    </section>
  );
};

export default Totals;
