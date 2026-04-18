import React from 'react';
import { useTranslation } from 'react-i18next';
import OrdersMiniList from './OrdersMiniList';
import OrderDetailPanel from './OrderDetailPanel';
import { useOrdersStore } from '../../store/useOrdersStore';
import styles from './DetailView.module.css';

/**
 * Two-pane Detailed View using CSS Modules.
 * Cleaned up to focus solely on order deep-dives.
 */
const DetailView = ({ orders = [] }) => {
    const { t } = useTranslation();
    const { activeOrderId } = useOrdersStore();

    return (
        <div className={styles.container}>
            <OrdersMiniList orders={orders} />
            
            <div className={styles.paneRight}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.activeTab}`}>
                        {t('admin.orders.detail.tab_info', 'Order Details')}
                    </button>
                    <div className={styles.spacer} />
                    <p className={styles.statusTip}>
                        {t('admin.orders.detail.status_hint', 'Previewing Active Order')}
                    </p>
                </div>

                <OrderDetailPanel orderId={activeOrderId} />
            </div>
        </div>
    );
};

export default DetailView;
