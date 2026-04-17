import React from 'react';
import styles from './DetailToggles.module.css';

/**
 * DetailToggles component to manage product switches.
 */
const DetailToggles = ({ product, onToggle, tp }) => {
    return (
        <div className={styles.card}>
            <h4 className={styles.cardTitle}>{tp('quick_toggles')}</h4>
            <div className={styles.toggleGroup}>
                <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                        <span className={styles.toggleLabel}>{tp('toggle_active')}</span>
                    </div>
                    <label className={styles.switch}>
                        <input 
                            type="checkbox" 
                            checked={product.is_active}
                            onChange={() => onToggle(product.id, 'is_active', product.is_active)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                        <span className={styles.toggleLabel}>{tp('toggle_featured')}</span>
                    </div>
                    <label className={styles.switch}>
                        <input 
                            type="checkbox" 
                            checked={product.is_featured}
                            onChange={() => onToggle(product.id, 'is_featured', product.is_featured)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.toggleItem}>
                    <div className={styles.toggleInfo}>
                        <span className={styles.toggleLabel}>{tp('toggle_trending')}</span>
                    </div>
                    <label className={styles.switch}>
                        <input 
                            type="checkbox" 
                            checked={product.is_trending}
                            onChange={() => onToggle(product.id, 'is_trending', product.is_trending)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default DetailToggles;
