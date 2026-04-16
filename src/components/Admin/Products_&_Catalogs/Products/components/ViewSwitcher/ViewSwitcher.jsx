import React from 'react';
import { List, LayoutGrid, PanelRightOpen } from 'lucide-react';
import styles from './ViewSwitcher.module.css';

/**
 * ViewSwitcher — 3-button segmented control to pick between Table / Grid / Detail views.
 * Persists choice in localStorage('adminProductView').
 * 
 * Props:
 *   - activeView ('table' | 'grid' | 'detail')
 *   - onViewChange(viewKey) callback
 */
const VIEW_OPTIONS = [
    { key: 'table', label: 'Table', icon: List },
    { key: 'grid', label: 'Grid', icon: LayoutGrid },
    { key: 'detail', label: 'Detail', icon: PanelRightOpen },
];

const ViewSwitcher = ({ activeView, onViewChange }) => {
    return (
        <div className={styles.switcher}>
            <span className={styles.label}>View:</span>
            <div className={styles.buttonGroup}>
                {VIEW_OPTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        className={`${styles.viewBtn} ${activeView === key ? styles.active : ''}`}
                        onClick={() => onViewChange(key)}
                        title={`${label} view`}
                    >
                        <Icon size={16} />
                        <span className={styles.btnLabel}>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ViewSwitcher;
