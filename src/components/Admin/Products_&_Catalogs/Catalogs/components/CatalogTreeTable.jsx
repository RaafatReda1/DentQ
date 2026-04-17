import React from 'react';
import { useTranslation } from 'react-i18next';
import CatalogRow from './CatalogRow';
import styles from './CatalogTreeTable.module.css';

const CatalogTreeTable = ({ 
    tree, 
    allFilteredCats,
    expandedIds, 
    toggleExpand, 
    inlineParentId, 
    setInlineParentId, 
    onEdit, 
    onDelete, 
    onToggleStatus, 
    onInlineSave,
    dragLogic 
}) => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);

    if (!tree || tree.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>{tp('no_categories') || 'No categories found.'}</p>
            </div>
        );
    }

    return (
        <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
                <div className={styles.colName}>{tp('col_name') || 'Category Name'}</div>
                <div className={styles.colSlug}>{tp('col_slug') || 'Slug URL'}</div>
                <div className={styles.colProducts}>{tp('col_products') || 'Products'}</div>
                <div className={styles.colStatus}>{tp('col_status') || 'Status'}</div>
                <div className={styles.colActions}>{tp('col_actions') || 'Actions'}</div>
            </div>

            <div className={styles.tableBody}>
                {tree.map(node => (
                    <CatalogRow
                        key={node.id}
                        node={node}
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
                        level={0}
                        siblings={tree}
                    />
                ))}
            </div>
        </div>
    );
};

export default CatalogTreeTable;
