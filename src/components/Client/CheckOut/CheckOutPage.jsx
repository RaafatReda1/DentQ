import React from 'react';
import { useCheckout } from './hooks/useCheckout';
import OwnerData from './SubComponents/OwnerData/OwnerData';
import OrderSum from './SubComponents/OrderSum/OrderSum';
import styles from './CheckOut.module.css';

/**
 * CheckOutPage Component
 * 
 * Uses useCheckout hook to handle logic.
 * Renders the checkout layout with OwnerData and OrderSum subcomponents.
 */
function CheckOutPage() {
  const {
    user,
    loading,
    formData,
    promoCode,
    isSubmitting,
    governorates,
    localizedGovernorates,
    handleChange,
    handlePaymentMethodChange,
    handleApplyPromoCode,
    handleRemovePromoCode,
    handleConfirmOrder,
    displayValues,
    t
  } = useCheckout();

  if (loading) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutWrapper}>
        <OwnerData
          user={user}
          formData={formData}
          handleChange={handleChange}
          handlePaymentMethodChange={handlePaymentMethodChange}
          governorates={governorates}
          localizedGovernorates={localizedGovernorates}
          t={t}
        />

        <OrderSum
          subtotal={displayValues.subtotal}
          shipping={displayValues.shipping}
          discount={displayValues.discount}
          total={displayValues.total}
          formData={formData}
          handleConfirmOrder={handleConfirmOrder}
          promoCode={promoCode}
          onApplyPromoCode={handleApplyPromoCode}
          onRemovePromoCode={handleRemovePromoCode}
          userId={user?.id}
          t={t}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default CheckOutPage;
