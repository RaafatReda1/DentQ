import React, { useState } from 'react';
import { useOrdersStore } from '../../store/useOrdersStore';
import { useOrderMutations } from '../../hooks/useOrderMutations';
import styles from './BulkActionsBar.module.css';

const BulkActionsBar = () => {
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
                <option value="">Move to...</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
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
