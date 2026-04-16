import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StatusBadge.module.css';

/**
 * StatusBadge — Derives a localized display label from the product's boolean flags.
 * Priority: Featured > Trending > Active > Inactive.
 */
const StatusBadge = ({ is_active, is_featured, is_trending, status: manualStatus, onClick }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);

    let status = manualStatus || 'inactive';
    
    if (!manualStatus) {
        if (is_active) status = 'active';
        if (is_trending) status = 'trending';
        if (is_featured) status = 'featured';
    }

    const labels = {
        active: tp('status_active'),
        inactive: tp('status_inactive'),
        featured: tp('status_featured'),
        trending: tp('status_trending'),
    };

    return (
        <span
            className={`${styles.badge} ${styles[status]}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {labels[status] || status}
        </span>
    );
};

export default StatusBadge;
