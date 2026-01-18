import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '../../../../utils/Hooks/useFormatPrice';
import styles from './OrderFooter.module.css';

const OrderFooter = ({ paymentMethod, totalAmount }) => {
    const { t } = useTranslation();
    const formatPrice = useFormatPrice();

    return (
        <div className={styles.orderFooter}>
            <div className={styles.footerContent}>
                <div className={styles.shippingInfo}>
                    <span className={styles.shippingLabel}>{t('orders.payment_method') || 'Payment Method'}</span>
                    <span className={styles.shippingValue}>
                        {paymentMethod === 'cash_on_delivery'
                            ? (t('checkout.cash_on_delivery') || 'Cash on Delivery')
                            : paymentMethod}
                    </span>
                </div>

                <div className={styles.orderTotal}>
                    <span className={styles.totalLabel}>{t('checkout.total') || 'Total'}:</span>
                    <span className={styles.totalAmount}>{formatPrice(totalAmount)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderFooter;
