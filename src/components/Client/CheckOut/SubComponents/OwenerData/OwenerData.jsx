import React from 'react';
import { User } from 'lucide-react';
import Form from './Form';
import OwnerDataField from './OwnerDataFeild';
import styles from './OwenerData.module.css';

const OwnerData = ({
  user,
  formData,
  handleChange,
  handlePaymentMethodChange,
  governorates,
  localizedGovernorates,
  t
}) => {
  return (
    <div className={styles.userSection}>
      <h2 className={styles.sectionTitle}>
        {t('checkout.shipping_info') || 'Shipping Information'}
      </h2>

      {!user || !user.session ? (
        <div className={styles.guestNotice}>
          <User size={20} />
          <span>{t('checkout.guest_checkout') || 'Guest Checkout'}</span>
        </div>
      ) : null}

      <Form
        formData={formData}
        handleChange={handleChange}
        governorates={governorates}
        localizedGovernorates={localizedGovernorates}
        t={t}
      />

      <OwnerDataField
        formData={formData}
        handlePaymentMethodChange={handlePaymentMethodChange}
        t={t}
      />
    </div>
  );
};

export default OwnerData;
