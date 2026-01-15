import styles from "./OerderSum.module.css";
import PromoCodeSection from "./PromoCodeSection";

const OrderSum = ({
  subtotal,
  shipping,
  discount,
  total,
  formData,
  handleConfirmOrder,
  promoCode,
  onApplyPromoCode,
  onRemovePromoCode,
  userId,
  t,
}) => {
  const checkValidForm = () => {
    if (
      !formData.full_name ||
      !formData.phone_number ||
      !formData.governorate_id ||
      !formData.address
    ) {
      return false;
    }
    return true;
  };
  return (
    <div className={styles.summarySection}>
      <h2 className={styles.sectionTitle}>
        {t("checkout.order_summary") || "Order Summary"}
      </h2>

      <div className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span>{t("checkout.subtotal") || "Subtotal"}</span>
          <span className={styles.price}>{subtotal}</span>
        </div>

        <div className={styles.summaryRow}>
          <span>{t("checkout.shipping") || "Shipping"}</span>
          <span className={styles.price}>
            {formData.governorate_id
              ? `${shipping}`
              : t("checkout.select_location") || "-"}
          </span>
        </div>

        {/* Discount Row - Only show if promo code is applied */}
        {promoCode.isApplied && (
          <div className={`${styles.summaryRow} ${styles.discount}`}>
            <span>
              {t("checkout.discount") || "Discount"} ({promoCode.code})
            </span>
            <span className={styles.discountPrice}>-{discount}</span>
          </div>
        )}

        <div className={styles.divider} />

        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span>{t("checkout.total") || "Total"}</span>
          <span className={styles.price}>{total}</span>
        </div>

        {/* PromoCodeSection */}
        <PromoCodeSection
          promoCode={promoCode}
          onApply={onApplyPromoCode}
          onRemove={onRemovePromoCode}
          userId={userId}
        />
        <button
          className={styles.confirmButton}
          disabled={!checkValidForm()}
          onClick={handleConfirmOrder}
        >
          {t("checkout.confirm_order") || "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default OrderSum;
