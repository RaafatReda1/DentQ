import React from "react";
import styles from "./OerderSum.module.css";
import { useTranslation } from "react-i18next";
const PromoCodeSection = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className={styles.promoSection}>
        <input
          type="text"
          className={styles.promoInput}
          placeholder={t("checkout.promo_code") || "Promo Code"}
          disabled
        />
        <button className={styles.promoButton} disabled>
          {t("checkout.apply") || "Apply"}
        </button>
      </div>
    </>
  );
};

export default PromoCodeSection;
