import React from 'react';
import styles from './Skeleton.module.css';

/**
 * Skeleton — Versatile loading placeholder.
 * Variants: card, row, detail-list, text, circle
 */
const Skeleton = ({ variant = 'text', count = 1, className = '' }) => {
    const renderSkeleton = (index) => {
        return (
            <div 
                key={index} 
                className={`${styles.skeleton} ${styles[variant]} ${className}`}
            />
        );
    };

    return (
        <>
            {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
        </>
    );
};

export default Skeleton;
