import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Catalogs.module.css';

// Hooks
import { useCatalogs } from './hooks/useCatalogs';
import { useSortable } from './hooks/useSortable';
import { useCatalogsUI } from './hooks/useCatalogsUI';

// Sub-components
import { StatsBar, CategoryFilters, CatalogTreeTable, CatalogSkeleton } from './components';
import CatalogsHeader from './components/CatalogsHeader/CatalogsHeader';
import CatalogsModals from './components/CatalogsModals/CatalogsModals';

const Catalogs = () => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);

    const { 
        categories, loading, error, addCategory, 
        updateCategory, deleteCategory, toggleActiveStatus, updateSortOrders 
    } = useCatalogs();

    const {
        search, setSearch, filters, setFilters, expandedIds, setExpandedIds,
        inlineParentId, setInlineParentId, filteredCats, tree, toggleExpand
    } = useCatalogsUI(categories);

    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleInlineSave = async (p) => {
        await addCategory(p);
        setInlineParentId(null);
        if (p.parent_id) setExpandedIds(prev => new Set(prev).add(p.parent_id));
    };

    const handleOpenEditModal = (cat = null) => { setEditTarget(cat); setModalOpen(true); };
    const handleCloseModal = () => { setEditTarget(null); setModalOpen(false); };

    const dragLogic = useSortable(updateSortOrders);

    return (
        <div className={styles.container}>
            <CatalogsHeader title={tp('menu_title')} onAddClick={() => handleOpenEditModal(null)} />
            {error && <div className={styles.errorBanner}>{error}</div>}
            <StatsBar categories={categories} />
            <CategoryFilters filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />

            {loading && categories.length === 0 ? <CatalogSkeleton /> : (
                <CatalogTreeTable 
                    tree={tree} allFilteredCats={filteredCats} expandedIds={expandedIds}
                    toggleExpand={toggleExpand} inlineParentId={inlineParentId} setInlineParentId={setInlineParentId}
                    onEdit={handleOpenEditModal} onDelete={setDeleteTarget} onToggleStatus={toggleActiveStatus}
                    onInlineSave={handleInlineSave} dragLogic={dragLogic}
                />
            )}

            <CatalogsModals 
                modalOpen={modalOpen} editTarget={editTarget} categories={categories}
                onSaveModal={async (p, id) => { id ? await updateCategory(id, p) : await addCategory(p); handleCloseModal(); }}
                onCloseModal={handleCloseModal} deleteTarget={deleteTarget}
                onCloseDelete={() => setDeleteTarget(null)} onConfirmDelete={async (id) => { await deleteCategory(id); setDeleteTarget(null); }}
            />
        </div>
    );
};

export default Catalogs;