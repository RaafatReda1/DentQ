import React from 'react';
import InlineAddForm from '../InlineAddForm/InlineAddForm';
import styles from './CatalogRow.module.css';
import { useCatalogRow } from './useCatalogRow';
import CatalogRowName from './CatalogRowName';
import CatalogRowData from './CatalogRowData';
import CatalogRowActions from './CatalogRowActions';

const CatalogRow = (props) => {
    const { node, allFilteredCats, expandedIds, toggleExpand, inlineParentId, setInlineParentId, 
            onEdit, onDelete, onToggleStatus, onInlineSave, dragLogic, level, siblings } = props;

    const { tp, hasChildren, isExpanded, isInlineAdding, canAddSub, name } = useCatalogRow({ node, expandedIds, inlineParentId, level });
    const { draggingId, dragOverId, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } = dragLogic;

    return (
        <>
            <div className={`${styles.row} ${draggingId === node.id ? styles.dragging : ''} ${dragOverId === node.id ? styles.dragOver : ''} ${!node.is_active ? styles.inactive : ''}`}
                 onDragOver={(e) => handleDragOver(e, node.id, node.level, siblings.find(s => s.id === draggingId)?.level)}
                 onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, node.id, siblings)}>
                
                <CatalogRowName node={node} level={level} hasChildren={hasChildren} isExpanded={isExpanded} 
                               toggleExpand={toggleExpand} name={name} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />

                <CatalogRowData node={node} onToggleStatus={onToggleStatus} />

                <CatalogRowActions node={node} canAddSub={canAddSub} onAddSub={setInlineParentId} 
                                  onEdit={onEdit} onDelete={onDelete} tp={tp} />
            </div>

            {isInlineAdding && <InlineAddForm parentId={node.id} parentSlug={node.slug} allFilteredCats={allFilteredCats} onSave={onInlineSave} onCancel={() => setInlineParentId(null)} />}

            {hasChildren && isExpanded && (
                <div className={styles.childrenWrapper}>
                    {node.children.map(child => <CatalogRow key={child.id} {...props} node={child} level={level + 1} siblings={node.children} />)}
                </div>
            )}
        </>
    );
};

export default CatalogRow;
