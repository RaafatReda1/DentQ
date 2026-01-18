import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag } from 'lucide-react';
import styles from './EmptyState.module.css';

const EmptyState = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
                <ShoppingBag className={styles.emptyIcon} size={80} />
                <div className={styles.emptyIconDecor}></div>
            </div>
            <h2 className={styles.emptyTitle}>{t('orders.no_orders') || 'No orders yet'}</h2>
            <p className={styles.emptySubtitle}>
                {t('orders.start_shopping') || "Looks like you haven't placed any orders yet. Start shopping to see your orders here!"}
            </p>
            <button className={styles.shopNowBtn} onClick={() => navigate('/')}>
                <ShoppingBag size={20} />
                {t('orders.shop_now') || 'Start Shopping'}
            </button>
        </div>
    );
};

export default EmptyState;
