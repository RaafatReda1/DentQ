import React from 'react';
import { Edit3, Copy, Trash2, Star } from 'lucide-react';
import styles from './DetailPanel.module.css';

/**
 * DetailPanel — Right-side detail pane for the selected product.
 * Shows product info, quick toggles, and stats.
 * 
 * Props:
 *   - product (object) — the selected product
 *   - onEdit(product)
 *   - onDuplicate(product)
 *   - onDelete(product)
 *   - onToggle(id, fieldName, currentValue) — quick toggle handler
 */
const DetailPanel = ({ product, onEdit, onDuplicate, onDelete, onToggle }) => {
    if (!product) {
        return (
            <div className={styles.emptyPanel}>
                <p>Select a product to view details</p>
            </div>
        );
    }

    const categoryName = product.Categories?.name_en || product.Categories?.name_ar || '';
    const discount = product.original_price && Number(product.original_price) > Number(product.price)
        ? Math.round((1 - Number(product.price) / Number(product.original_price)) * 100)
        : null;

    const getStockClass = () => {
        if (product.stock === 0) return styles.stockDanger;
        if (product.stock <= 20) return styles.stockWarning;
        return styles.stockGood;
    };

    return (
        <div className={styles.panel}>
            {/* Header: image + name */}
            <div className={styles.header}>
                <div className={styles.headerImage}>
                    {product.images?.length > 0 ? (
                        <img src={product.images[0]} alt={product.nameEn} className={styles.mainImg} />
                    ) : (
                        <div className={styles.imgPlaceholder}>img</div>
                    )}
                </div>
                <div className={styles.headerInfo}>
                    <h3 className={styles.productName}>{product.nameEn}</h3>
                    <p className={styles.productMeta}>
                        {categoryName && <span>{categoryName}</span>}
                        {categoryName && <span> · </span>}
                        <span className={styles.idSnippet}>ID: {product.id?.substring(0, 6)}…</span>
                    </p>
                    <div className={styles.priceRow}>
                        <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
                        {product.original_price && Number(product.original_price) > Number(product.price) && (
                            <span className={styles.originalPrice}>${Number(product.original_price).toFixed(0)}</span>
                        )}
                        {discount && (
                            <span className={styles.discountBadge}>−{discount}%</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={() => onEdit(product)}>
                    <Edit3 size={15} /> Edit product
                </button>
                <button className={styles.actionBtn} onClick={() => onDuplicate(product)}>
                    <Copy size={15} /> Duplicate
                </button>
                <button className={`${styles.actionBtn} ${styles.deleteActionBtn}`} onClick={() => onDelete(product)}>
                    <Trash2 size={15} /> Delete
                </button>
            </div>

            {/* Quick Toggles */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>QUICK TOGGLES</h4>
                <div className={styles.toggleList}>
                    {[
                        { field: 'is_active', label: 'Active (is_active)' },
                        { field: 'is_featured', label: 'Featured (is_featured)' },
                        { field: 'is_trending', label: 'Trending (is_trending)' },
                    ].map(({ field, label }) => (
                        <div key={field} className={styles.toggleRow}>
                            <span className={styles.toggleLabel}>{label}</span>
                            <label className={styles.toggleSwitch}>
                                <input
                                    type="checkbox"
                                    checked={product[field] || false}
                                    onChange={() => onToggle(product.id, field, product[field])}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inventory & Stats */}
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>INVENTORY & STATS</h4>
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Stock</span>
                        <span className={`${styles.statValue} ${getStockClass()}`}>
                            {product.stock} units{product.stock <= 20 && product.stock > 0 ? ' (low)' : ''}
                        </span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Sales count</span>
                        <span className={styles.statValue}>{(product.sales_count || 0).toLocaleString()}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Views</span>
                        <span className={styles.statValue}>{(product.views || 0).toLocaleString()}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Rating</span>
                        <span className={styles.statValue}>
                            {product.rating ? (
                                <span className={styles.ratingDisplay}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            size={14}
                                            fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'}
                                            color="#f59e0b"
                                        />
                                    ))}
                                    <span className={styles.ratingNum}>
                                        {Number(product.rating).toFixed(1)}
                                    </span>
                                    <span className={styles.reviewCount}>
                                        ({product.review_count || 0})
                                    </span>
                                </span>
                            ) : '—'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPanel;
