import React, { useState } from "react";
import styles from "./OerderSum.module.css";
import { useTranslation } from "react-i18next";

const PromoCodeSection = ({ promoCode, onApply, onRemove, userId }) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handleApply = () => {
    if (!inputValue.trim()) return;
    onApply(inputValue);
  };

  const handleRemove = () => {
    setInputValue('');
    onRemove();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim() && !promoCode.isLoading) {
      handleApply();
    }
  };

  // Show applied state with remove button
  if (promoCode.isApplied) {
    return (
      <div className={styles.promoSection}>
        <div className={styles.promoApplied}>
          <span className={styles.promoCode}>
            ✓ {promoCode.code}
            {promoCode.discountType === 'percentage'
              ? ` (-${promoCode.discountValue}%)`
              : ''}
          </span>
          <button
            className={styles.removeButton}
            onClick={handleRemove}
            type="button"
          >
            {t("checkout.remove") || "Remove"}
          </button>
        </div>
      </div>
    );
  }

  // Show input state with apply button
  return (
    <div className={styles.promoSection}>
      <input
        type="text"
        className={styles.promoInput}
        placeholder={t("checkout.promo_code") || "Promo Code"}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
        onKeyPress={handleKeyPress}
        disabled={promoCode.isLoading}
      />
      <button
        className={styles.promoButton}
        onClick={handleApply}
        disabled={promoCode.isLoading || !inputValue.trim()}
        type="button"
      >
        {promoCode.isLoading
          ? t("checkout.applying") || "Applying..."
          : t("checkout.apply") || "Apply"}
      </button>
    </div>
  );
};

export default PromoCodeSection;
