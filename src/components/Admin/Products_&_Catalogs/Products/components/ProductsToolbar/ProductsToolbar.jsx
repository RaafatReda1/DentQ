import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, Download, ListChecks } from 'lucide-react';
import ViewSwitcher from '../ViewSwitcher/ViewSwitcher';
import styles from './ProductsToolbar.module.css';

/**
 * ProductsToolbar — Top bar with search, filters, sort, view switcher, and actions.
 * 
 * Props:
 *   - searchTerm / onSearchChange
 *   - categoryFilter / onCategoryChange
 *   - statusFilter / onStatusChange
 *   - sortBy / onSortChange
 *   - activeView / onViewChange
 *   - categories[] — for category dropdown
 *   - onAddProduct() — opens the add form
 *   - selectedCount (number) — count of selected items for bulk actions
 *   - onBulkAction(action) — 'activate' | 'deactivate' | 'delete'
 *   - onExportCSV() — exports current data as CSV
 */
const ProductsToolbar = ({
    searchTerm, onSearchChange,
    categoryFilter, onCategoryChange,
    statusFilter, onStatusChange,
    sortBy, onSortChange,
    activeView, onViewChange,
    categories = [],
    onAddProduct,
    selectedCount = 0,
    onBulkAction,
    onExportCSV,
}) => {
    // Debounce search input
    const [localSearch, setLocalSearch] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch]);

    // Sync external searchTerm changes (e.g. when filters reset)
    useEffect(() => {
        setLocalSearch(searchTerm);
    }, [searchTerm]);

    return (
        <div className={styles.toolbar}>
            {/* Top row: title + search + actions */}
            <div className={styles.topRow}>
                <div className={styles.leftGroup}>
                    <h2 className={styles.title}>Products</h2>
                    <div className={styles.searchBox}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search products..."
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.rightGroup}>
                    {/* Bulk actions — visible when items selected */}
                    {selectedCount > 0 && (
                        <div className={styles.bulkActions}>
                            <ListChecks size={16} />
                            <span className={styles.bulkCount}>{selectedCount} selected</span>
                            <select
                                className={styles.bulkSelect}
                                onChange={(e) => {
                                    if (e.target.value) onBulkAction(e.target.value);
                                    e.target.value = '';
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>Bulk actions</option>
                                <option value="activate">Activate</option>
                                <option value="deactivate">Deactivate</option>
                                <option value="delete">Delete selected</option>
                            </select>
                        </div>
                    )}

                    <ViewSwitcher activeView={activeView} onViewChange={onViewChange} />

                    <button className={styles.addBtn} onClick={onAddProduct}>
                        <Plus size={18} />
                        <span>Add product</span>
                    </button>
                </div>
            </div>

            {/* Bottom row: filters + sort + export */}
            <div className={styles.filtersRow}>
                <div className={styles.filterGroup}>
                    {/* Category filter */}
                    <div className={styles.selectWrapper}>
                        <select
                            value={categoryFilter || ''}
                            onChange={(e) => onCategoryChange(e.target.value || null)}
                            className={styles.filterSelect}
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name_en || cat.name_ar}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className={styles.selectIcon} />
                    </div>

                    {/* Status filter */}
                    <div className={styles.selectWrapper}>
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="featured">Featured</option>
                            <option value="trending">Trending</option>
                        </select>
                        <ChevronDown size={14} className={styles.selectIcon} />
                    </div>

                    {/* Sort */}
                    <div className={styles.selectWrapper}>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                            <option value="name_asc">Name: A → Z</option>
                        </select>
                        <ChevronDown size={14} className={styles.selectIcon} />
                    </div>
                </div>

                {/* Export CSV */}
                <button className={styles.exportBtn} onClick={onExportCSV}>
                    <Download size={15} />
                    <span>Export CSV</span>
                </button>
            </div>
        </div>
    );
};

export default ProductsToolbar;
