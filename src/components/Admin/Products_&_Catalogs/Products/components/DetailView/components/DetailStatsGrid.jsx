import React from 'react';
import { Tag, ShoppingBag, Eye, Star } from 'lucide-react';
import styles from './DetailStatsGrid.module.css';

/**
 * DetailStatsGrid component to display product metrics.
 */
const DetailStatsGrid = ({ product, tp }) => {
    return (
        <div className={styles.card}>
            <h4 className={styles.cardTitle}>{tp('inventory_stats')}</h4>
            <div className={styles.statsGrid}>
                <div className={styles.miniStat}>
                    <Tag size={16} className={styles.statIcon} />
                    <div className={styles.statInfo}>
                        <span className={styles.statVal}>{product.stock}</span>
                        <span className={styles.statLabel}>{tp('stock_label')}</span>
                    </div>
                </div>
                <div className={styles.miniStat}>
                    <ShoppingBag size={16} className={styles.statIcon} />
                    <div className={styles.statInfo}>
                        <span className={styles.statVal}>{product.sales_count || 0}</span>
                        <span className={styles.statLabel}>{tp('sales_count')}</span>
                    </div>
                </div>
                <div className={styles.miniStat}>
                    <Eye size={16} className={styles.statIcon} />
                    <div className={styles.statInfo}>
                        <span className={styles.statVal}>{product.views || 0}</span>
                        <span className={styles.statLabel}>{tp('views_label')}</span>
                    </div>
                </div>
                <div className={styles.miniStat}>
                    <Star size={16} className={styles.statIcon} />
                    <div className={styles.statInfo}>
                        <span className={styles.statVal}>{product.rating || '0.0'}</span>
                        <span className={styles.statLabel}>{tp('rating_label')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailStatsGrid;
