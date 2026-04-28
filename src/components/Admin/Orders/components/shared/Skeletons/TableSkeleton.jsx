import React from 'react';
import styles from './Skeletons.module.css';

const TableSkeleton = () => {
  return (
    <div className={styles.tableSkeletonOuter}>
      <div className={styles.tableSkeletonHeader}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.skeletonBoxHeading}></div>
        ))}
      </div>
      
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className={styles.tableSkeletonRow}>
          {[...Array(8)].map((_, colIndex) => (
            <div 
              key={colIndex} 
              className={styles.skeletonBox}
              style={{ 
                width: colIndex === 1 ? '100px' : colIndex === 2 ? '150px' : '80px',
                animationDelay: `${(rowIndex * 0.1) + (colIndex * 0.05)}s`
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
