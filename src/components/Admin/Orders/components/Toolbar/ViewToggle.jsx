import React from 'react';
import { useOrdersStore } from '../../store/useOrdersStore';
import { LayoutGrid, Table, ListTree, ShoppingCart } from 'lucide-react';
import styles from './ViewToggle.module.css';

const ViewToggle = () => {
    const { activeView, setView } = useOrdersStore();
    
    const modes = [
        { id: 'table',  icon: Table,         label: 'Table' },
        { id: 'kanban', icon: LayoutGrid,    label: 'Board' },
        { id: 'detail', icon: ListTree,      label: 'Detail' },
        { id: 'carts',  icon: ShoppingCart,  label: 'Carts' }
    ];

    return (
        <div className={styles.container}>
            {modes.map(mode => (
                <button
                    key={mode.id}
                    onClick={() => setView(mode.id)}
                    className={`${styles.button} ${activeView === mode.id ? styles.active : ''}`}
                >
                    <mode.icon size={16} />
                    <span className={styles.label}>{mode.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ViewToggle;
