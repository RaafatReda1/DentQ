import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import styles from './CatalogRowActions.module.css';

/**
 * Action buttons for the CatalogRow (Add Sub, Edit, Delete).
 */
const CatalogRowActions = ({ node, canAddSub, onAddSub, onEdit, onDelete, tp }) => {
    return (
        <div className={styles.actionsCell}>
            {canAddSub && (
                <button 
                    className={styles.actionBtn} 
                    onClick={() => onAddSub(node.id)}
                    title={tp('add_sub')}
                >
                    <Plus size={16} />
                </button>
            )}
            <button className={styles.actionBtn} onClick={() => onEdit(node)} title={tp('edit')}>
                <Edit2 size={16} />
            </button>
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(node)} title={tp('delete')}>
                <Trash2 size={16} />
            </button>
        </div>
    );
};

export default CatalogRowActions;
