import React from 'react';
import { GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import styles from './CatalogRowName.module.css';

const BadgeMap = {
    0: { class: 'rootBadge', label: 'ROOT' },
    1: { class: 'subBadge', label: 'SUB' },
    2: { class: 'deepBadge', label: 'DEEP' }
};

/**
 * First column of the CatalogRow, containing drag handle, expand toggle, and name.
 */
const CatalogRowName = ({ 
    node, level, hasChildren, isExpanded, toggleExpand, name, handleDragStart, handleDragEnd 
}) => {
    return (
        <div 
            className={styles.nameCell}
            style={{ paddingLeft: `${(level * 24) + 12}px` }}
        >
            <div 
                className={styles.dragHandle}
                draggable
                onDragStart={(e) => handleDragStart(e, node.id)}
                onDragEnd={handleDragEnd}
            >
                <GripVertical size={16} />
            </div>

            <button 
                className={`${styles.expandBtn} ${hasChildren ? '' : styles.hiddenBtn}`}
                onClick={() => toggleExpand(node.id)}
            >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            <span className={`${styles.levelBadge} ${styles[BadgeMap[level]?.class]}`}>
                {BadgeMap[level]?.label || level}
            </span>

            <span className={styles.catName}>{name}</span>
        </div>
    );
};

export default CatalogRowName;
