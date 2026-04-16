import React from 'react';
import styles from './StatusBadge.module.css';

/**
 * StatusBadge — Derives a single display label from the product's boolean flags.
 * Priority: Featured > Trending > Active > Inactive.
 * 
 * Props:
 *   - is_active (bool)
 *   - is_featured (bool)
 *   - is_trending (bool)
 *   - onClick (optional callback)
 */
const StatusBadge = ({ is_active, is_featured, is_trending, onClick }) => {
    let status = 'inactive';
    let label = 'Inactive';

    if (is_active) {
        status = 'active';
        label = 'Active';
    }
    if (is_trending) {
        status = 'trending';
        label = 'Trending';
    }
    if (is_featured) {
        status = 'featured';
        label = 'Featured';
    }

    return (
        <span
            className={`${styles.badge} ${styles[status]}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {label}
        </span>
    );
};

export default StatusBadge;
