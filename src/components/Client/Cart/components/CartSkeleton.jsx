import React from 'react';
import styles from '../CartPage.module.css';

const CartSkeleton = () => (
  <div className={styles.skeletonContainer}>
    {[1, 2, 3].map((i) => (
      <div key={i} className={styles.skeletonItem}>
        <div className={styles.skeletonImage}></div>
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLineShort}></div>
        </div>
      </div>
    ))}
  </div>
);

export default CartSkeleton;
