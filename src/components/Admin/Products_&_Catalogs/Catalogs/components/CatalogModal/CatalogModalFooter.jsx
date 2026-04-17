import React from 'react';
import styles from './CatalogModalFooter.module.css';

/**
 * Footer section of the Catalog Modal with action buttons.
 */
const CatalogModalFooter = ({ loading, isValid, tp, onClose }) => {
    return (
        <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                {tp('cancel')}
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading || !isValid}>
                {loading ? tp('saving') : tp('save')}
            </button>
        </div>
    );
};

export default CatalogModalFooter;
