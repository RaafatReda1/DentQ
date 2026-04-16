import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './TableRow.module.css';

/**
 * TableRow — Single row in the products data table.
 * Supports bilingual name display and i18n.
 */
const TableRow = ({
    product,
    isSelected,
    onSelect,
    onEdit,
    onView,
    onDelete
}) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const currentLang = i18n.language;

    const name = currentLang === 'ar' ? (product.nameAr || product.nameEn) : (product.nameEn || product.nameAr);
    const categoryName = currentLang === 'ar' ? (product.Categories?.name_ar || product.Categories?.name_en) : (product.Categories?.name_en || product.Categories?.name_ar);

    // Stock color logic
    const getStockClass = (stock) => {
        if (stock <= 0) return styles.stockOut;
        if (stock <= 20) return styles.stockLow;
        return styles.stockOk;
    };

    // Derived status
    const getStatus = () => {
        if (product.is_featured) return 'featured';
        if (product.is_trending) return 'trending';
        return product.is_active ? 'active' : 'inactive';
    };

    return (
        <tr className={`${styles.row} ${isSelected ? styles.selected : ''}`}>
            {/* Checkbox */}
            <td className={styles.checkCell}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(product.id)}
                    className={styles.checkbox}
                />
            </td>

            {/* Product Image & Info */}
            <td className={styles.productCell}>
                <div className={styles.productWrapper}>
                    <div className={styles.imageBox}>
                        <img 
                            src={product.images?.[0] || 'https://placehold.net/1.png'} 
                            alt={name} 
                            className={`${styles.thumb} ${!product.images?.[0] ? styles.noThumb : ''}`} 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.net/1.png'; e.target.classList.add(styles.noThumb); }}
                        />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.nameRow}>
                            <span className={styles.name} title={name}>{name}</span>
                            {product.is_featured && <Star size={12} className={styles.featuredIcon} fill="currentColor" />}
                        </div>
                        <span className={styles.category}>{categoryName || '—'}</span>
                    </div>
                </div>
            </td>

            {/* Price */}
            <td className={styles.priceCell}>
                <div className={styles.priceWrapper}>
                    <span className={styles.price}>${Number(product.price).toLocaleString()}</span>
                    {product.original_price && (
                        <span className={styles.originalPrice}>${Number(product.original_price).toLocaleString()}</span>
                    )}
                </div>
            </td>

            {/* Stock */}
            <td className={`${styles.stockCell} ${getStockClass(product.stock)}`}>
                {product.stock} {tp('units')}
            </td>

            {/* Status */}
            <td className={styles.statusCell}>
                <StatusBadge status={getStatus()} />
            </td>

            {/* Rating */}
            <td className={styles.ratingCell}>
                <div className={styles.ratingBox}>
                    <Star size={14} className={styles.starIcon} fill="currentColor" />
                    <span>{product.rating || '0.0'}</span>
                </div>
            </td>

            {/* Actions */}
            <td className={styles.actionCell}>
                <div className={styles.actionGroup}>
                    <button className={styles.actionBtn} onClick={() => onEdit(product)} title={tp('btn_edit')}>
                        {tp('btn_edit')}
                    </button>
                    <button className={styles.actionBtn} onClick={() => onView(product)} title={tp('btn_view')}>
                        {tp('btn_view')}
                    </button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(product)} title={tp('btn_delete')}>
                        {tp('btn_delete')}
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TableRow;
