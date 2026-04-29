import React from 'react';
import { Edit3, Trash2, Copy } from 'lucide-react';
import styles from './DetailHeader.module.css';
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";

/**
 * DetailHeader component for Product Detail view.
 */
const DetailHeader = ({ 
    category, 
    name, 
    price, 
    originalPrice, 
    discount, 
    onEdit, 
    onDelete, 
    product,
    tp 
}) => {
  const { t } = useTranslation();
    const handleCopyId = () => {
        navigator.clipboard.writeText(product.id);
        toast.success(tp('id_copied') || 'ID Copied!');
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <div className={styles.categoryPath}>{category || '—'}</div>
                <h2 className={styles.title}>{name}</h2>
                <div className={styles.priceRow}>
                    <span className={styles.price}>${Number(price).toLocaleString()}</span>
                    {originalPrice && (
                        <span className={styles.originalPrice}>${Number(originalPrice).toLocaleString()}</span>
                    )}
                    {discount > 0 && (
                        <span className={styles.discountBadge}>-{discount}% OFF</span>
                    )}
                </div>
            </div>
            
            <div className={styles.mainActions}>
                <button className={styles.editBtn} onClick={handleCopyId} title={t("admin.catalog.copy_id", "Copy ID")}>
                    <Copy size={18} />
                </button>
                <button className={styles.editBtn} onClick={() => onEdit(product)}>
                    <Edit3 size={18} />
                    <span>{tp('btn_edit')}</span>
                </button>
                <button className={styles.deleteBtn} onClick={() => onDelete(product)}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default DetailHeader;
