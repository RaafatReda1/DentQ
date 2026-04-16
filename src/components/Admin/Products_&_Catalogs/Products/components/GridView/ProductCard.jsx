import React from 'react';
import { Star } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './ProductCard.module.css';

/**
 * ProductCard — A single product card for the Grid view.
 * Features: status badges, stock progress bar, inactive dimming, featured border.
 * 
 * Props:
 *   - product (object)
 *   - onEdit(product) / onView(product) / onDelete(product)
 */
const MAX_STOCK = 200; // Baseline for stock bar percentage

const ProductCard = ({ product, onEdit, onView, onDelete }) => {
    const isInactive = !product.is_active;
    const isFeatured = product.is_featured;
    const isTrending = product.is_trending;

    // Stock bar percentage
    const stockPercent = Math.min((product.stock / MAX_STOCK) * 100, 100);
    const getStockBarColor = () => {
        if (stockPercent === 0) return '#ef4444';
        if (stockPercent < 10) return '#ef4444';
        if (stockPercent < 30) return '#f59e0b';
        return '#22c55e';
    };

    const categoryName = product.Categories?.name_en || product.Categories?.name_ar || '';

    return (
        <div
            className={`${styles.card} ${isInactive ? styles.inactive : ''} ${isFeatured ? styles.featured : ''}`}
        >
            {/* Status badges overlay */}
            <div className={styles.badges}>
                {isFeatured && (
                    <StatusBadge is_active={true} is_featured={true} is_trending={false} />
                )}
                {isTrending && (
                    <StatusBadge is_active={true} is_featured={false} is_trending={true} />
                )}
                {!isFeatured && !isTrending && product.is_active && (
                    <StatusBadge is_active={true} is_featured={false} is_trending={false} />
                )}
                {isInactive && (
                    <StatusBadge is_active={false} is_featured={false} is_trending={false} />
                )}
            </div>

            {/* Image */}
            <div className={styles.imageArea}>
                {product.images?.length > 0 ? (
                    <img src={product.images[0]} alt={product.nameEn} className={styles.productImg} />
                ) : (
                    <div className={styles.imgPlaceholder}>img</div>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <h4 className={styles.name}>{product.nameEn}</h4>
                <p className={styles.meta}>
                    {categoryName && <span>{categoryName}</span>}
                    {categoryName && product.rating && <span> · </span>}
                    {product.rating && (
                        <span className={styles.rating}>
                            {Number(product.rating).toFixed(1)} <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        </span>
                    )}
                </p>
            </div>

            {/* Price + Stock row */}
            <div className={styles.priceRow}>
                <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
                <span className={`${styles.stockText} ${product.stock === 0 ? styles.stockDanger : product.stock <= 20 ? styles.stockWarning : ''}`}>
                    {product.stock} left
                </span>
            </div>

            {/* Stock progress bar */}
            <div className={styles.stockBar}>
                <div
                    className={styles.stockFill}
                    style={{
                        width: `${stockPercent}%`,
                        backgroundColor: getStockBarColor(),
                    }}
                />
            </div>

            {/* Action buttons */}
            <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => onEdit(product)}>Edit</button>
                <button className={styles.actionBtn} onClick={() => onView(product)}>View</button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(product)}>Del</button>
            </div>
        </div>
    );
};

export default ProductCard;
