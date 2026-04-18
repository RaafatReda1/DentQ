import React from 'react';
import styles from './OrderCheckbox.module.css';

/**
 * Custom checkbox for Order selection using CSS Modules.
 */
const OrderCheckbox = ({ checked, onChange }) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className={styles.checkbox}
        />
    );
};

export default OrderCheckbox;
