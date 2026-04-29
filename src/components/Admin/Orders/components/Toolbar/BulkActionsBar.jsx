import React, { useState } from 'react';
import { useOrdersStore } from '../../store/useOrdersStore';
import { useOrderMutations } from '../../hooks/useOrderMutations';
import styles from './BulkActionsBar.module.css';
import { useTranslation } from "react-i18next";

const BulkActionsBar = () => {
  const { t } = useTranslation();
    const { selectedIds, clearSelection } = useOrdersStore();
    const { mutate: updateStatus, isLoading } = useOrderMutations();
    const [targetStatus, setTargetStatus] = useState('');

    if (selectedIds.size === 0) return null;

    const handleApply = () => {
        if (!targetStatus) return;
        updateStatus({ id: Array.from(selectedIds), status: targetStatus });
        setTargetStatus('');
    };

    return (
        <div className={styles.container}>
            <span className={styles.selectionText}>
                {selectedIds.size} orders selected
            </span>
            <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className={styles.select}
            >
                <option value="">{t("admin.orders.ui.move_to", "Move to...")}</option>
                <option value="pending">{t("admin.orders.ui.pending", "Pending")}</option>
                <option value="paid">{t("admin.orders.ui.paid", "Paid")}</option>
                <option value="shipped">{t("admin.orders.ui.shipped", "Shipped")}</option>
                <option value="delivered">{t("admin.orders.ui.delivered", "Delivered")}</option>
            </select>
            <button
                disabled={!targetStatus || isLoading}
                onClick={handleApply}
                className={styles.applyBtn}
            >
                {isLoading ? 'Applying...' : 'Apply'}
            </button>
            <button onClick={clearSelection} className={styles.clearBtn}>
                Clear
            </button>
        </div>
    );
};

export default BulkActionsBar;
