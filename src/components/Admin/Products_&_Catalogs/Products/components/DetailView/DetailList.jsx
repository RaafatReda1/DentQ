import React from 'react';
import { Star } from 'lucide-react';
import styles from './DetailList.module.css';

/**
 * DetailList — Left-side scrollable product list for Master/Detail view.
 * Shows compact product entries with thumbnail, name, category, rating, price, stock.
 * 
 * Props:
 *   - products[] — all fetched products
 *   - selectedId (string) — currently selected product ID
 *   - onSelect(product) — selects a product to show in detail panel
 *   - stats: { total, active, lowStock }
 */
const DetailList = ({ products, selectedId, onSelect, stats }) => {
    return (
        <div className={styles.listContainer}>
            {/* Compact stats bar */}
            <div className={styles.compactStats}>
                <span><strong>{stats.total}</strong> total</span>
                <span className={styles.dot}>·</span>
                <span className={styles.activeCount}><strong>{stats.active}</strong> active</span>
                <span className={styles.dot}>·</span>
                <span className={styles.lowStockCount}><strong>{stats.lowStock}</strong> low stock</span>
            </div>

            {/* Product list */}
            <div className={styles.list}>
                {products.map((product) => {
                    const isSelected = product.id === selectedId;
                    const categoryName = product.Categories?.name_en || product.Categories?.name_ar || '';

                    return (
                        <button
                            key={product.id}
                            className={`${styles.listItem} ${isSelected ? styles.selected : ''}`}
                            onClick={() => onSelect(product)}
                        >
                            {/* Thumbnail */}
                            <div className={styles.thumb}>
                                {product.images?.length > 0 ? (
                                    <img src={product.images[0]} alt="" className={styles.thumbImg} />
                                ) : (
                                    <span className={styles.thumbPlaceholder}>img</span>
                                )}
                            </div>

                            {/* Info */}
                            <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{product.nameEn}</span>
                                <span className={styles.itemMeta}>
                                    {categoryName && <span>{categoryName}</span>}
                                    {product.rating && (
                                        <>
                                            <span> · </span>
                                            <Star size={10} fill="#f59e0b" color="#f59e0b" />
                                            <span> {Number(product.rating).toFixed(1)}</span>
                                        </>
                                    )}
                                </span>
                                <span className={styles.itemPrice}>
                                    ${Number(product.price).toFixed(2)}
                                    {product.stock !== null && (
                                        <span className={product.stock <= 10 ? styles.lowStock : ''}>
                                            {' '}· {product.stock} left
                                        </span>
                                    )}
                                </span>
                            </div>
                        </button>
                    );
                })}

                {products.length === 0 && (
                    <div className={styles.emptyState}>No products found</div>
                )}
            </div>
        </div>
    );
};

export default DetailList;
