import React from 'react';
import styles from './CatalogRowData.module.css';

/**
 * Middle columns of the CatalogRow: Slug, Product Count, and Status Toggle.
 */
const CatalogRowData = ({ node, onToggleStatus }) => {
    return (
        <>
            <div className={styles.colSlug}>
                <span className={styles.slugTxt}>{node.slug}</span>
            </div>

            <div className={styles.colProducts}>
                <span className={styles.productBadge}>{node.totalProducts || 0}</span>
            </div>

            <div className={styles.colStatus}>
                <label className={styles.toggleSwitch}>
                    <input
                        type="checkbox"
                        checked={node.is_active}
                        onChange={() => onToggleStatus(node.id, node.is_active)}
                    />
                    <span className={styles.slider}></span>
                </label>
            </div>
        </>
    );
};

export default CatalogRowData;
