import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from './DeleteConfirmModal.module.css';

/**
 * DeleteConfirmModal — Confirmation dialog before deleting a product.
 * 
 * Props:
 *   - isOpen (bool)
 *   - productName (string) — displayed in the message
 *   - onConfirm() — fires the delete
 *   - onCancel() — closes the modal
 *   - loading (bool) — shows spinner on confirm button
 */
const DeleteConfirmModal = ({ isOpen, productName, onConfirm, onCancel, loading }) => {
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

                <h3 className={styles.title}>Delete Product</h3>
                <p className={styles.message}>
                    Are you sure you want to delete <strong>"{productName}"</strong>?
                    This action cannot be undone.
                </p>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className={styles.deleteBtn} onClick={onConfirm} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
