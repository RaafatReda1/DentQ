import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import styles from './Catalogs.module.css';

// Hooks & Lib
import { useCatalogs } from './hooks/useCatalogs';
import { useSortable } from './hooks/useSortable';
import { flatToTree } from './lib/catalogHelpers';

// Components
import StatsBar from './components/StatsBar';
import CategoryFilters from './components/CategoryFilters';
import CatalogTreeTable from './components/CatalogTreeTable';
import CatalogModal from './components/CatalogModal';
import DeleteConfirm from './components/DeleteConfirm';
import CatalogSkeleton from './components/CatalogSkeleton';

const Catalogs = () => {
    const { t } = useTranslation();
    const tp = (key) => t(`admin.catalogs.${key}`);

    // Data Source
    const { 
        categories, 
        loading, 
        error, 
        addCategory, 
        updateCategory, 
        deleteCategory, 
        toggleActiveStatus,
        updateSortOrders 
    } = useCatalogs();

    // UI States
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ level: 'all', status: 'all' });
    
    // Core interaction states
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [inlineParentId, setInlineParentId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // Derived Trees
    const filteredCats = useMemo(() => {
        let result = categories;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(c => 
                (c.name_en && c.name_en.toLowerCase().includes(q)) || 
                (c.name_ar && c.name_ar.includes(q))
            );
        }
        
        if (filters.level !== 'all') {
            result = result.filter(c => c.level === Number(filters.level));
        }

        if (filters.status !== 'all') {
            const boolStatus = filters.status === 'active';
            result = result.filter(c => c.is_active === boolStatus);
        }

        return result;
    }, [categories, search, filters]);

    const tree = useMemo(() => flatToTree(filteredCats), [filteredCats]);

    // Drag and Drop Instance
    const dragLogic = useSortable(updateSortOrders);

    // Handlers
    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleOpenEditModal = (category = null) => {
        setEditTarget(category);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditTarget(null);
        setModalOpen(false);
    };

    const handleSaveModal = async (payload, id) => {
        if (id) {
            await updateCategory(id, payload);
        } else {
            await addCategory(payload);
        }
        handleCloseModal();
    };

    const handleInlineSave = async (payload) => {
        await addCategory(payload);
        setInlineParentId(null);
        // Auto-expand parent to show new item
        if (payload.parent_id) {
            setExpandedIds(prev => new Set(prev).add(payload.parent_id));
        }
    };

    const confirmDelete = async (id) => {
        await deleteCategory(id);
        setDeleteTarget(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{tp('menu_title') || 'Catalogs Navigator'}</h1>
                <button className={styles.addBtn} onClick={() => handleOpenEditModal(null)}>
                    <Plus size={18} />
                    {tp('add_root') || 'Add Root Category'}
                </button>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            <StatsBar categories={categories} />
            
            <CategoryFilters 
                filters={filters} 
                setFilters={setFilters} 
                search={search} 
                setSearch={setSearch} 
            />

            {loading && categories.length === 0 ? (
                <CatalogSkeleton />
            ) : (
                <CatalogTreeTable 
                    tree={tree}
                    allFilteredCats={filteredCats}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                    inlineParentId={inlineParentId}
                    setInlineParentId={setInlineParentId}
                    onEdit={handleOpenEditModal}
                    onDelete={setDeleteTarget}
                    onToggleStatus={toggleActiveStatus}
                    onInlineSave={handleInlineSave}
                    dragLogic={dragLogic}
                />
            )}

            <CatalogModal 
                isOpen={modalOpen}
                category={editTarget}
                allFilteredCats={categories} 
                onSave={handleSaveModal}
                onClose={handleCloseModal}
            />

            <DeleteConfirm 
                isOpen={!!deleteTarget}
                category={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default Catalogs;