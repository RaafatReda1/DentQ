import React from 'react';
import { ListChecks } from 'lucide-react';
import styles from './BulkActions.module.css';

/**
 * BulkActions — Component to handle batch operations on selected products.
 */
const BulkActions = ({ selectedCount, onBulkAction, tp }) => {
    if (selectedCount === 0) return null;

    return (
        <div className={styles.bulkActions}>
            <ListChecks size={16} />
            <span className={styles.bulkCount}>{selectedCount} {tp('selected')}</span>
            <select
                className={styles.bulkSelect}
                onChange={(e) => {
                    if (e.target.value) onBulkAction(e.target.value);
                    e.target.value = '';
                }}
                defaultValue=""
            >
                <option value="" disabled>{tp('bulk_actions')}</option>
                <option value="activate">{tp('activate')}</option>
                <option value="deactivate">{tp('deactivate')}</option>
                <option value="delete">{tp('delete_selected')}</option>
            </select>
        </div>
    );
};

export default BulkActions;
