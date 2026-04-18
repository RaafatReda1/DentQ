import React from 'react';
import styles from './ProductHoverStrip.module.css';

/**
 * Floating mini-thumbnail strip for product peeking on hover.
 */
const ProductHoverStrip = ({ products = [], visible }) => {
    if (!products.length) return null;

    return (
        <div className={`${styles.strip} ${visible ? styles.show : ''}`}>
            {products.slice(0, 5).map((p, i) => (
                <div key={i} className={styles.imageBox}>
                    <img 
                        src={p.images?.[0] || '/placeholder.png'} 
                        alt={p.nameEn} 
                        className={styles.thumb} 
                    />
                </div>
            ))}
            {products.length > 5 && (
                <div className={`${styles.imageBox} ${styles.morePill}`}>
                    +{products.length - 5}
                </div>
            )}
        </div>
    );
};

export default ProductHoverStrip;
