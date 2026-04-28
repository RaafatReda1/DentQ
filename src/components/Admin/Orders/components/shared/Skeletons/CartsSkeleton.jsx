import React from 'react';
import styles from './Skeletons.module.css';

const CartsSkeleton = () => {
  return (
    <div className={styles.cartsSkeletonContainer}>
      {/* Search/Filter Toolbar Placeholder */}
      <div className={styles.tableSkeletonHeader} style={{ marginBottom: '24px', borderRadius: '16px' }}>
          <div className={styles.skeletonBoxHeading} style={{ width: '200px' }}></div>
          <div className={styles.skeletonBoxHeading} style={{ width: '100px' }}></div>
      </div>

      <div className={styles.cartsGrid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.cartSkeletonCard} style={{ animationDelay: `${i * 0.1}s` }}>
             <div className={styles.skeletonBoxHeading} style={{ width: '50%', marginBottom: '20px' }}></div>
             <div className={styles.skeletonBox} style={{ width: '100%', marginBottom: '12px' }}></div>
             <div className={styles.skeletonBox} style={{ width: '80%', marginBottom: '20px' }}></div>
             <div style={{ display: 'flex', gap: '10px' }}>
                <div className={styles.skeletonBox} style={{ width: '60px', borderRadius: '20px' }}></div>
                <div className={styles.skeletonBox} style={{ width: '60px', borderRadius: '20px' }}></div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartsSkeleton;
