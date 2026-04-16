import React from 'react';
import { Star } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';
import styles from './TableRow.module.css';

/**
 * TableRow — Single row in the products data table.
 * 
 * Props:
 *   - product (object)
 *   - isSelected (bool)
 *   - onSelect(id) — toggle checkbox
 *   - onEdit(product)
 *   - onView(product)
 *   - onDuplicate(product)
 *   - onDelete(product)
 */
const TableRow = ({ product, isSelected, onSelect, onEdit, onView, onDuplicate, onDelete }) => {
    // Stock color: green > 20, orange ≤ 20, red = 0
    const getStockClass = (stock) => {
        if (stock === 0) return styles.stockDanger;
        if (stock <= 20) return styles.stockWarning;
        return styles.stockGood;
    };

    const getStockIcon = (stock) => {
        if (stock === 0) return '✕';
        if (stock <= 20) return '⚠';
        return '';
    };

    const categoryName = product.Categories?.name_en || product.Categories?.name_ar || '—';

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

            {/* Image */}
            <td className={styles.imgCell}>
                {product.images?.length > 0 ? (
                    <img src={product.images[0]} alt={product.nameEn} className={styles.productImg} />
                ) : (
                    <div className={styles.imgPlaceholder}>img</div>
                )}
            </td>

            {/* Name + Category */}
            <td className={styles.nameCell}>
                <span className={styles.productName}>{product.nameEn}</span>
                <span className={styles.category}>{categoryName}</span>
            </td>

            {/* Price */}
            <td className={styles.priceCell}>
                <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
                {product.original_price && Number(product.original_price) > Number(product.price) && (
                    <span className={styles.originalPrice}>${Number(product.original_price).toFixed(0)}</span>
                )}
            </td>

            {/* Stock */}
            <td className={`${styles.stockCell} ${getStockClass(product.stock)}`}>
                <span>{product.stock} {getStockIcon(product.stock)}</span>
            </td>

            {/* Status */}
            <td className={styles.statusCell}>
                <StatusBadge
                    is_active={product.is_active}
                    is_featured={product.is_featured}
                    is_trending={product.is_trending}
                />
            </td>

            {/* Rating */}
            <td className={styles.ratingCell}>
                {product.rating ? (
                    <span className={styles.rating}>
                        {Number(product.rating).toFixed(1)} <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    </span>
                ) : (
                    <span className={styles.noRating}>—</span>
                )}
            </td>

            {/* Actions */}
            <td className={styles.actionsCell}>
                <button className={styles.actionBtn} onClick={() => onEdit(product)} title="Edit">Edit</button>
                <button className={styles.actionBtn} onClick={() => onView(product)} title="View">View</button>
                <button className={styles.actionBtn} onClick={() => onDuplicate(product)} title="Duplicate">Dup</button>
                <button className={`${styles.actionBtn} ${styles.deleteActionBtn}`} onClick={() => onDelete(product)} title="Delete">Del</button>
            </td>
        </tr>
    );
};

export default TableRow;
