import React from 'react';
import { Star, Edit3, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './ProductCard.module.css';

/**
 * ProductCard — Individual product card for Grid view.
 * Supports bilingual naming and i18n.
 */
const ProductCard = ({ product, onEdit, onDelete }) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const currentLang = i18n.language;

    const name = currentLang === 'ar' ? (product.nameAr || product.nameEn) : (product.nameEn || product.nameAr);
    const categoryName = currentLang === 'ar' ? (product.Categories?.name_ar || product.Categories?.name_en) : (product.Categories?.name_en || product.Categories?.name_ar);

    const MAX_STOCK = 150; // Dynamic scaling ceiling
    const stockPercent = Math.min((product.stock / MAX_STOCK) * 100, 100);

    const getStockColor = () => {
        if (product.stock <= 10) return 'var(--danger-color)';
        if (product.stock <= 50) return 'var(--warning-color)';
        return 'var(--success-color)';
    };

    const getStatus = () => {
        if (product.is_featured) return 'featured';
        if (product.is_trending) return 'trending';
        return product.is_active ? 'active' : 'inactive';
    };

    return (
        <div className={`${styles.card} ${!product.is_active ? styles.inactive : ''} ${product.is_featured ? styles.featured : ''}`}>
            {/* Badges */}
            <div className={styles.badgeRow}>
                <StatusBadge status={getStatus()} />
                <div className={styles.ratingBadge}>
                    <Star size={12} fill="currentColor" />
                    <span>{product.rating || '0.0'}</span>
                </div>
            </div>

            {/* Image */}
            <div className={styles.imageContainer}>
                {product.images?.[0] ? (
                    <img 
                        src={product.images[0]} 
                        alt={name} 
                        className={styles.image} 
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div className={styles.imagePlaceholder} style={{ display: product.images?.[0] ? 'none' : 'flex' }}></div>
            </div>

            {/* Title & Cat */}
            <div className={styles.info}>
                <h3 className={styles.name} title={name}>{name}</h3>
                <span className={styles.category}>{categoryName || '—'}</span>
            </div>

            {/* Price & Stock */}
            <div className={styles.stats}>
                <div className={styles.priceRow}>
                    <span className={styles.price}>${Number(product.price).toLocaleString()}</span>
                    {product.original_price && (
                        <span className={styles.original}>${Number(product.original_price).toLocaleString()}</span>
                    )}
                </div>

                <div className={styles.stockInfo}>
                    <div className={styles.stockLabel}>
                        <span>{tp('stock_label')}</span>
                        <span style={{ color: getStockColor() }}>
                            {product.stock} {tp('units')}
                        </span>
                    </div>
                    <div className={styles.stockBar}>
                        <div
                            className={styles.stockFill}
                            style={{ width: `${stockPercent}%`, backgroundColor: getStockColor() }}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => onEdit(product)}>
                    <Edit3 size={16} />
                    <span>{tp('btn_edit')}</span>
                </button>
                <button className={styles.deleteBtn} onClick={() => onDelete(product)}>
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
