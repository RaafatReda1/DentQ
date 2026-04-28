import React from 'react';
import styles from './Skeletons.module.css';

const DetailSkeleton = () => {
  return (
    <div className={styles.detailSkeletonContainer}>
      <div className={styles.detailSkeletonLeft}>
        <div className={styles.skeletonBoxHeading} style={{ width: '180px', margin: '20px' }}></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.detailSkeletonListItem} style={{ animationDelay: `${i * 0.1}s` }}>
             <div className={styles.skeletonBoxHeading} style={{ width: '80%', marginBottom: '8px' }}></div>
             <div className={styles.skeletonBox} style={{ width: '40%' }}></div>
          </div>
        ))}
      </div>
      
      <div className={styles.detailSkeletonRight}>
         <div className={styles.tableSkeletonHeader} style={{ borderBottom: '1px solid #f1f5f9' }}>
           <div className={styles.skeletonBoxHeading} style={{ width: '150px' }}></div>
         </div>
         <div style={{ padding: '40px' }}>
             <div className={styles.skeletonBoxHeading} style={{ width: '40%', height: '30px', marginBottom: '30px' }}></div>
             <div className={styles.skeletonBox} style={{ width: '100%', marginBottom: '16px' }}></div>
             <div className={styles.skeletonBox} style={{ width: '90%', marginBottom: '16px' }}></div>
             <div className={styles.skeletonBox} style={{ width: '100%', marginBottom: '16px' }}></div>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px' }}>
                 <div className={styles.cartSkeletonCard}>
                     <div className={styles.skeletonBoxHeading} style={{ marginBottom: '16px' }}></div>
                     <div className={styles.skeletonBox}></div>
                 </div>
                 <div className={styles.cartSkeletonCard}>
                     <div className={styles.skeletonBoxHeading} style={{ marginBottom: '16px' }}></div>
                     <div className={styles.skeletonBox}></div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
