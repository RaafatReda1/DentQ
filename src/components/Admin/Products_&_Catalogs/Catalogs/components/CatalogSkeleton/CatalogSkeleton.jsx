import React from 'react';
import styles from './CatalogSkeleton.module.css';

const CatalogSkeleton = () => {
    // Generate an array of 5 items to simulate table rows
    const rows = Array.from({ length: 5 });

    return (
        <div className={styles.skeletonWrapper}>
            {/* Mock Header */}
            <div className={styles.skeletonHeader}>
                <div className={styles.shimmerHeader} style={{ width: '150px' }}></div>
                <div className={styles.shimmerHeader} style={{ width: '100px' }}></div>
                <div className={styles.shimmerHeader} style={{ width: '80px' }}></div>
                <div className={styles.shimmerHeader} style={{ width: '80px' }}></div>
                <div className={styles.shimmerHeader} style={{ width: '100px' }}></div>
            </div>

            {/* Mock Rows */}
            <div className={styles.skeletonBody}>
                {rows.map((_, i) => (
                    <div key={i} className={styles.skeletonRow}>
                        {/* Title & Badge */}
                        <div className={styles.colName}>
                            <div className={styles.sq} style={{ width: '20px', height: '20px' }}></div>
                            <div className={styles.badge} style={{ width: '40px' }}></div>
                            <div className={styles.line} style={{ width: '180px' }}></div>
                        </div>
                        {/* Slug */}
                        <div className={styles.colSlug}>
                            <div className={styles.line} style={{ width: '120px' }}></div>
                        </div>
                        {/* Products */}
                        <div className={styles.colProducts}>
                            <div className={styles.pill}></div>
                        </div>
                        {/* Status */}
                        <div className={styles.colStatus}>
                            <div className={styles.toggle}></div>
                        </div>
                        {/* Actions */}
                        <div className={styles.colActions}>
                            <div className={styles.sq} style={{ width: '24px' }}></div>
                            <div className={styles.sq} style={{ width: '24px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatalogSkeleton;
