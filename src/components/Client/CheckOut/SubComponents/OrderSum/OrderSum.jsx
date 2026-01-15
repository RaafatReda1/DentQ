import validatePromoCode from "../../../../../utils/CheckPromoCodeValidity";
import styles from "./OerderSum.module.css";
import PromoCodeSection from "./PromoCodeSection";

const OrderSum = async ({
  subtotal,
  shipping,
  total,
  formData,
  handleConfirmOrder,
  t,
}) => {
  const checkValidForm = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.governorateId ||
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
            {formData.governorateId
              ? `${shipping}`
              : t("checkout.select_location") || "-"}
          </span>
        </div>

        <div className={styles.divider} />

        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span>{t("checkout.total") || "Total"}</span>
          <span className={styles.price}>{total}</span>
        </div>
        {/* PromoCodeSection */}
        <PromoCodeSection/>
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
