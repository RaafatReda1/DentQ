import React from 'react';
import { X } from 'lucide-react';
import styles from './CatalogModalHeader.module.css';

/**
 * Header section of the Catalog Modal.
 */
const CatalogModalHeader = ({ isEditing, tp, onClose }) => {
    return (
        <div className={styles.header}>
            <h3 className={styles.title}>
                {isEditing ? tp('edit_catalog') : tp('add_root')}
            </h3>
            <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
            </button>
        </div>
    );
};

export default CatalogModalHeader;
