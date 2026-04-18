import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import OrderItemRow from './OrderItemRow';
import styles from './OrderItemsPopup.module.css';

/**
 * Premium detailed modal with interactive expanding product rows.
 * Uses React Portal to ensure the modal is never clipped by parent containers.
 */
const OrderItemsPopup = ({ isOpen, onClose, items = [], title }) => {
    const { t } = useTranslation();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title || t('admin.orders.modal_title', 'Order Breakdown')}</h3>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <X size={22} />
                    </button>
                </div>
                <div className={styles.content}>
                    {items.map((item, i) => <OrderItemRow key={i} item={item} />)}
                    {items.length === 0 && (
                        <div className={styles.empty}>
                            <p>{t('admin.orders.empty_modal', 'No products found in this selection.')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default OrderItemsPopup;
