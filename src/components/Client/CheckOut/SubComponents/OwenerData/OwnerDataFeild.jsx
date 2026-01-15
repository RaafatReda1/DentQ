import React from 'react';
import { CreditCard, Truck } from 'lucide-react';
import styles from './OwenerData.module.css';

const OwnerDataField = ({ formData, handlePaymentMethodChange, t }) => {
  return (
    <div className={styles.paymentSection}>
      <h3 className={styles.sectionSubtitle}>
        <CreditCard size={18} />
        {t('checkout.payment_method') || 'Payment Method'}
      </h3>

      <div className={styles.paymentOptions}>
        <label className={`${styles.paymentOption} ${formData.payment_method === 'cash_on_delivery' ? styles.selected : ''}`}>
          <input
            type="radio"
            name="payment_method"
            value="cash_on_delivery"
            checked={formData.payment_method === 'cash_on_delivery'}
            onChange={() => handlePaymentMethodChange('cash_on_delivery')}
          />
          <div className={styles.paymentContent}>
            <Truck size={20} />
            <span>{t('checkout.cash_on_delivery') || 'Cash on Delivery'}</span>
          </div>
        </label>

        <label className={`${styles.paymentOption} ${styles.disabled}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            disabled
          />
          <div className={styles.paymentContent}>
            <CreditCard size={20} />
            <span>{t('checkout.online_payment') || 'Online Payment'}</span>
            <span className={styles.comingSoon}>{t('checkout.coming_soon') || 'Coming Soon'}</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default OwnerDataField;