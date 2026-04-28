import React from 'react';
import styles from './Skeletons.module.css';

const KanbanSkeleton = () => {
  return (
    <div className={styles.kanbanSkeletonContainer}>
      {[...Array(5)].map((_, colIndex) => (
        <div key={colIndex} className={styles.kanbanColumn}>
          <div className={`${styles.skeletonBoxHeading} ${styles.kanbanHeader}`}></div>
          
          <div className={styles.kanbanCards}>
             {/* Render random number of fake cards purely for aesthetics */}
            {[...Array(colIndex % 2 === 0 ? 3 : 2)].map((_, cardIndex) => (
              <div 
                 key={cardIndex} 
                 className={styles.kanbanCard}
                 style={{ animationDelay: `${(colIndex * 0.1) + (cardIndex * 0.1)}s` }}
              >
                  <div className={styles.skeletonBox} style={{ width: '60%', height: '14px', marginBottom: '12px' }}></div>
                  <div className={styles.skeletonBox} style={{ width: '90%', height: '12px', marginBottom: '8px' }}></div>
                  <div className={styles.skeletonBox} style={{ width: '40%', height: '12px' }}></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanSkeleton;
