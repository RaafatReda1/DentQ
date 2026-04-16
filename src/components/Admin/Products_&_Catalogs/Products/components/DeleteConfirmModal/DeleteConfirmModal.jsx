import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DeleteConfirmModal.module.css';

/**
 * DeleteConfirmModal — Localized confirmation dialog.
 */
const DeleteConfirmModal = ({ isOpen, productName, onConfirm, onCancel, loading }) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onCancel}>
                    <X size={18} />
                </button>

                <div className={styles.iconWrapper}>
                    <AlertTriangle size={32} />
                </div>

                <h3 className={styles.title}>{tp('delete_title')}</h3>
                <p className={styles.message}>
                    {tp('delete_confirm')} <strong>"{productName}"</strong>?
                    <br />
                    {tp('delete_warning')}
                </p>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
                        {tp('cancel')}
                    </button>
                    <button className={styles.deleteBtn} onClick={onConfirm} disabled={loading}>
                        {loading ? tp('deleting') : tp('delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
