import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronDown, GripVertical, Edit2, Trash2, Plus } from 'lucide-react';
import InlineAddForm from './InlineAddForm';
import styles from './CatalogRow.module.css';
import tableStyles from './CatalogTreeTable.module.css';

const BadgeMap = {
    0: { class: 'rootBadge', label: 'ROOT' },
    1: { class: 'subBadge', label: 'SUB' },
    2: { class: 'deepBadge', label: 'DEEP' }
};

const CatalogRow = ({
    node,
    allFilteredCats,
    expandedIds,
    toggleExpand,
    inlineParentId,
    setInlineParentId,
    onEdit,
    onDelete,
    onToggleStatus,
    onInlineSave,
    dragLogic,
    level,
    siblings
}) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isInlineAdding = inlineParentId === node.id;
    
    // Level constraints
    const canAddSub = level < 2;

    const name = i18n.language === 'ar' ? (node.name_ar || node.name_en) : (node.name_en || node.name_ar);

    const {
        draggingId,
        dragOverId,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd
    } = dragLogic;

    return (
        <>
            <div 
                className={`
                    ${styles.row} 
                    ${draggingId === node.id ? styles.dragging : ''}
                    ${dragOverId === node.id ? styles.dragOver : ''}
                    ${!node.is_active ? styles.inactive : ''}
                `}
                onDragOver={(e) => handleDragOver(e, node.id, node.level, siblings.find(s => s.id === draggingId)?.level)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, node.id, siblings)}
            >
                <div 
                    className={`${tableStyles.colName} ${styles.nameCell}`}
                    style={{ paddingLeft: `${(level * 24) + 12}px` }}
                >
                    {/* Drag Handle */}
                    <div 
                        className={styles.dragHandle}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.id)}
                        onDragEnd={handleDragEnd}
                    >
                        <GripVertical size={16} />
                    </div>

                    {/* Expand Toggle */}
                    <button 
                        className={`${styles.expandBtn} ${hasChildren ? '' : styles.hiddenBtn}`}
                        onClick={() => toggleExpand(node.id)}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {/* Level Badge */}
                    <span className={`${styles.levelBadge} ${styles[BadgeMap[level]?.class]}`}>
                        {BadgeMap[level]?.label || level}
                    </span>

                    <span className={styles.catName}>{name}</span>
                </div>

                <div className={tableStyles.colSlug}>
                    <span className={styles.slugTxt}>{node.slug}</span>
                </div>

                <div className={tableStyles.colProducts}>
                    <span className={styles.productBadge}>{node.totalProducts || 0}</span>
                </div>

                <div className={tableStyles.colStatus}>
                    <label className={styles.toggleSwitch}>
                        <input
                            type="checkbox"
                            checked={node.is_active}
                            onChange={() => onToggleStatus(node.id, node.is_active)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={`${tableStyles.colActions} ${styles.actionsCell}`}>
                    {canAddSub && (
                        <button 
                            className={styles.actionBtn} 
                            onClick={() => setInlineParentId(node.id)}
                            title={tp('add_sub') || 'Add Sub-Category'}
                        >
                            <Plus size={16} />
                        </button>
                    )}
                    <button 
                        className={styles.actionBtn} 
                        onClick={() => onEdit(node)}
                        title={tp('edit') || 'Edit Category'}
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                        onClick={() => onDelete(node)}
                        title={tp('delete') || 'Delete'}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Inline Add Form Rendering Slot */}
            {isInlineAdding && (
                <InlineAddForm 
                    parentId={node.id}
                    parentSlug={node.slug}
                    allFilteredCats={allFilteredCats}
                    onSave={onInlineSave}
                    onCancel={() => setInlineParentId(null)}
                />
            )}

            {/* Recursive Children Rendering */}
            {hasChildren && isExpanded && (
                <div className={styles.childrenWrapper}>
                    {node.children.map(childNode => (
                        <CatalogRow
                            key={childNode.id}
                            node={childNode}
                            allFilteredCats={allFilteredCats}
                            expandedIds={expandedIds}
                            toggleExpand={toggleExpand}
                            inlineParentId={inlineParentId}
                            setInlineParentId={setInlineParentId}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                            onInlineSave={onInlineSave}
                            dragLogic={dragLogic}
                            level={level + 1}
                            siblings={node.children}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default CatalogRow;
