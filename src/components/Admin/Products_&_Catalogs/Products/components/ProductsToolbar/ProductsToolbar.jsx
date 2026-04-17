import React from 'react';
import { Plus, ChevronDown, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Hooks
import { useProductsToolbar } from '../../hooks/useProductsToolbar';

// Sub-components
import ViewSwitcher from '../ViewSwitcher/ViewSwitcher';
import SmartSearchBox from './SmartSearchBox';
import CategoryDropdown from './CategoryDropdown';
import BulkActions from './BulkActions';

import styles from './ProductsToolbar.module.css';

/**
 * ProductsToolbar — Top bar with smart search, searchable category dropdown,
 * filters, sort, view switcher, and actions.
 * Refactored to be cleaner and more modular.
 */
const ProductsToolbar = (props) => {
    const {
        searchTerm, onSearchChange,
        categoryFilter, onCategoryChange,
        statusFilter, onStatusChange,
        sortBy, onSortChange,
        activeView, onViewChange,
        categories = [],
        allProducts = [],
        onAddProduct,
        selectedCount = 0,
        onBulkAction,
        onExportCSV
    } = props;

    const { t } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);

    const {
        localSearch,
        setLocalSearch,
        showSuggestions,
        setShowSuggestions,
        searchRef,
        showCatDropdown,
        setShowCatDropdown,
        catSearch,
        setCatSearch,
        catRef,
        suggestions,
        handleSuggestionClick,
        filteredCategories,
        selectedCatName,
        isAr
    } = useProductsToolbar({
        searchTerm,
        onSearchChange,
        categories,
        allProducts,
        categoryFilter,
        onCategoryChange
    });

    return (
        <div className={styles.toolbar}>
            {/* Top row: title + search + actions */}
            <div className={styles.topRow}>
                <div className={styles.leftGroup}>
                    <h2 className={styles.title}>{tp('title')}</h2>

                    <SmartSearchBox
                        localSearch={localSearch}
                        setLocalSearch={setLocalSearch}
                        showSuggestions={showSuggestions}
                        setShowSuggestions={setShowSuggestions}
                        searchRef={searchRef}
                        suggestions={suggestions}
                        handleSuggestionClick={handleSuggestionClick}
                        onSearchChange={onSearchChange}
                        tp={tp}
                    />
                </div>

                <div className={styles.rightGroup}>
                    <BulkActions
                        selectedCount={selectedCount}
                        onBulkAction={onBulkAction}
                        tp={tp}
                    />

                    <ViewSwitcher activeView={activeView} onViewChange={onViewChange} />

                    <button className={styles.addBtn} onClick={onAddProduct}>
                        <Plus size={18} />
                        <span>{tp('add_product')}</span>
                    </button>
                </div>
            </div>

            {/* Bottom row: filters + sort + export */}
            <div className={styles.filtersRow}>
                <div className={styles.filterGroup}>
                    <CategoryDropdown
                        showCatDropdown={showCatDropdown}
                        setShowCatDropdown={setShowCatDropdown}
                        catSearch={catSearch}
                        setCatSearch={setCatSearch}
                        catRef={catRef}
                        selectedCatName={selectedCatName}
                        filteredCategories={filteredCategories}
                        categoryFilter={categoryFilter}
                        onCategoryChange={onCategoryChange}
                        isAr={isAr}
                        tp={tp}
                    />

                    {/* Status filter */}
                    <div className={styles.selectWrapper}>
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">{tp('all_status')}</option>
                            <option value="active">{tp('status_active')}</option>
                            <option value="inactive">{tp('status_inactive')}</option>
                            <option value="featured">{tp('status_featured')}</option>
                            <option value="trending">{tp('status_trending')}</option>
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
                            <option value="newest">{tp('sort_newest')}</option>
                            <option value="price_asc">{tp('sort_price_asc')}</option>
                            <option value="price_desc">{tp('sort_price_desc')}</option>
                            <option value="name_asc">{tp('sort_name_asc')}</option>
                        </select>
                        <ChevronDown size={14} className={styles.selectIcon} />
                    </div>
                </div>

                {/* Export CSV */}
                <button className={styles.exportBtn} onClick={onExportCSV}>
                    <Download size={15} />
                    <span>{tp('export_csv')}</span>
                </button>
            </div>
        </div>
    );
};

export default ProductsToolbar;
