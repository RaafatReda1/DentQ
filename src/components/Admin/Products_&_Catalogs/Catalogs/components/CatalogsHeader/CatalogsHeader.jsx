import React from 'react';
import { Plus } from 'lucide-react';
import styles from './CatalogsHeader.module.css';

/**
 * Header section for the Catalogs page.
 */
const CatalogsHeader = ({ title, onAddClick }) => {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <button className={styles.addBtn} onClick={onAddClick}>
                <Plus size={18} />
                <span>Add Root Category</span>
            </button>
        </div>
    );
};

export default CatalogsHeader;
