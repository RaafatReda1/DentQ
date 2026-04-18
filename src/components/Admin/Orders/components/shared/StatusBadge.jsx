import React from 'react';
import styles from './StatusBadge.module.css';

/**
 * Reusable, colored status pill for Orders using CSS Modules.
 */
const StatusBadge = ({ status, className = "" }) => {
    // Dynamically select class from module based on status id
    const statusClass = styles[status] || styles.pending;
    
    return (
        <span className={`${styles.badge} ${statusClass} ${className}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default StatusBadge;
