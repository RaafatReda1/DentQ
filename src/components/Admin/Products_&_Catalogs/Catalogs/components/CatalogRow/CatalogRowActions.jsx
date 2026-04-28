import React from 'react';
import { Plus, Edit2, Trash2, Copy } from 'lucide-react';
import styles from './CatalogRowActions.module.css';
import toast from 'react-hot-toast';

/**
 * Action buttons for the CatalogRow (Add Sub, Edit, Delete).
 */
const CatalogRowActions = ({ node, canAddSub, onAddSub, onEdit, onDelete, tp }) => {
    const handleCopyId = () => {
        navigator.clipboard.writeText(node.id);
        toast.success(tp('id_copied') || 'ID Copied!');
    };

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
            <button className={styles.actionBtn} onClick={handleCopyId} title="Copy ID">
                <Copy size={16} />
            </button>
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
