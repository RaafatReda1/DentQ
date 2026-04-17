import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DeleteConfirm.module.css';

const DeleteConfirm = ({ isOpen, category, onClose, onConfirm }) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);
    const [loading, setLoading] = useState(false);

    if (!isOpen || !category) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm(category.id);
        } finally {
            setLoading(false);
            onClose();
        }
    };

    const name = i18n.language === 'ar' ? category.name_ar || category.name_en : category.name_en || category.name_ar;

    // Recursively count all descendant children that would be cascaded
    const countDescendants = (cat) => {
        let sum = cat.children?.length || 0;
        if (cat.children) {
            sum += cat.children.reduce((acc, child) => acc + countDescendants(child), 0);
        }
        return sum;
    };

    const childrenCount = countDescendants(category);
    // Uses the new totalProducts algorithm from catalogHelpers which includes descendants' products
    const productsCount = category.totalProducts || 0;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <AlertTriangle size={24} className={styles.warningIcon} />
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>
                
                <h3 className={styles.title}>{tp('delete_title') || 'Delete Category'}</h3>
                <p className={styles.desc}>
                    {tp('delete_confirm_desc') || `Are you sure you want to delete `} 
                    <strong>"{name}"</strong>?
                </p>

                {(childrenCount > 0 || productsCount > 0) && (
                    <div className={styles.warningBox}>
                        <p className={styles.warningText}>
                            {tp('delete_cascade_warn') || 'This action will also cascade and un-link:'}
                        </p>
                        <ul className={styles.cascadeList}>
                            {childrenCount > 0 && <li><strong>{childrenCount}</strong> nested sub-categories</li>}
                            {productsCount > 0 && <li><strong>{productsCount}</strong> associated products</li>}
                        </ul>
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
                        {tp('cancel') || 'Cancel'}
                    </button>
                    <button className={styles.confirmBtn} onClick={handleConfirm} disabled={loading}>
                        {loading ? tp('deleting') || 'Deleting...' : tp('confirm_delete') || 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;
