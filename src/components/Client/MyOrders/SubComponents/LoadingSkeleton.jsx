import React from 'react';
import styles from './LoadingSkeleton.module.css';

const LoadingSkeleton = () => {
    return (
        <div className={styles.loadingContainer}>
            {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonHeader}>
                        <div className={`${styles.skeletonLine} ${styles.skeletonLineMedium}`}></div>
                        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                    </div>
                    {[1, 2].map((j) => (
                        <div key={j} className={styles.skeletonItem}>
                            <div className={styles.skeletonImage}></div>
                            <div className={styles.skeletonContent}>
                                <div className={styles.skeletonLine}></div>
                                <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
