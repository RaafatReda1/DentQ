import React from 'react';
import { useTranslation } from 'react-i18next';
import OrderItem from './OrderItem';
import styles from './OrderBody.module.css';

const OrderBody = ({ items, isExpanded, onNavigateToProduct }) => {
    const { t } = useTranslation();
    const itemsCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className={`${styles.orderBodyWrapper} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.orderBody}>
                <div className={styles.itemsHeader}>
                    <div className={styles.itemsTitle}>
                        {t('orders.items') || 'Items'}
                        <span className={styles.itemCount}>{itemsCount}</span>
                    </div>
                </div>

                <div className={styles.itemsList}>
                    {items && items.map((item, idx) => (
                        <OrderItem
                            key={`${item.id}-${idx}`}
                            item={item}
                            product={item.product}
                            onNavigateToProduct={onNavigateToProduct}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderBody;
