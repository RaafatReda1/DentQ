import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, ChevronDown, Download, ListChecks, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ViewSwitcher from '../ViewSwitcher/ViewSwitcher';
import styles from './ProductsToolbar.module.css';

/**
 * ProductsToolbar — Top bar with smart search, searchable category dropdown,
 * filters, sort, view switcher, and actions.
 * 
 * Props:
 *   - searchTerm / onSearchChange
 *   - categoryFilter / onCategoryChange
 *   - statusFilter / onStatusChange
 *   - sortBy / onSortChange
 *   - activeView / onViewChange
 *   - categories[] — for category dropdown (flat list with parent_id + level)
 *   - allProducts[] — for smart search suggestions
 *   - onAddProduct()
 *   - selectedCount / onBulkAction / onExportCSV
 */
const ProductsToolbar = ({
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
    onExportCSV,
}) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const isAr = i18n.language === 'ar';

    // ─── Search state ───
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // ─── Category dropdown state ───
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [catSearch, setCatSearch] = useState('');
    const catRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => onSearchChange(localSearch), 300);
        return () => clearTimeout(timer);
    }, [localSearch]);

    useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            if (catRef.current && !catRef.current.contains(e.target)) {
                setShowCatDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ─── Smart search suggestions ───
    const suggestions = useMemo(() => {
        const q = localSearch.trim().toLowerCase();
        if (!q || q.length < 2) return [];

        const results = [];
        const seen = new Set();

        // 1. Match product names (EN + AR)
        for (const p of allProducts) {
            if (results.length >= 8) break;
            const nameEn = (p.nameEn || '').toLowerCase();
            const nameAr = (p.nameAr || '').toLowerCase();
            if (nameEn.includes(q) || nameAr.includes(q)) {
                if (!seen.has(p.id)) {
                    seen.add(p.id);
                    results.push({
                        type: 'product',
                        label: isAr ? (p.nameAr || p.nameEn) : p.nameEn,
                        sublabel: tp('search_in_name'),
                        price: p.price,
                        image: p.images?.[0],
                        id: p.id,
                    });
                }
            }
        }

        // 2. Match category names
        for (const cat of categories) {
            if (results.length >= 10) break;
            const catNameEn = (cat.name_en || '').toLowerCase();
            const catNameAr = (cat.name_ar || '').toLowerCase();
            if (catNameEn.includes(q) || catNameAr.includes(q)) {
                results.push({
                    type: 'category',
                    label: isAr ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar),
                    sublabel: tp('search_in_category'),
                    catId: cat.id,
                    id: `cat_${cat.id}`,
                });
            }
        }

        // 3. Match price patterns like "$50", "50", ">100"
        const priceMatch = q.match(/^\$?(\d+(?:\.\d+)?)/);
        if (priceMatch) {
            const price = Number(priceMatch[1]);
            const nearby = allProducts.filter(
                (p) => Math.abs(Number(p.price) - price) <= price * 0.2
            ).slice(0, 3);
            for (const p of nearby) {
                if (!seen.has(p.id)) {
                    seen.add(p.id);
                    results.push({
                        type: 'price',
                        label: isAr ? (p.nameAr || p.nameEn) : p.nameEn,
                        sublabel: `$${Number(p.price).toFixed(2)} · ${tp('search_in_price')}`,
                        id: `price_${p.id}`,
                    });
                }
            }
        }

        return results;
    }, [localSearch, allProducts, categories, isAr]);

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'category') {
            onCategoryChange(suggestion.catId);
            setLocalSearch('');
            onSearchChange('');
        } else {
            setLocalSearch(suggestion.label);
            onSearchChange(suggestion.label);
        }
        setShowSuggestions(false);
    };

    // ─── Build hierarchical category tree for the dropdown ───
    const categoryTree = useMemo(() => {
        // Build parent → children map
        const parentMap = {};
        const roots = [];

        for (const cat of categories) {
            if (!cat.parent_id) {
                roots.push(cat);
                parentMap[cat.id] = [];
            }
        }

        for (const cat of categories) {
            if (cat.parent_id && parentMap[cat.parent_id]) {
                parentMap[cat.parent_id].push(cat);
            } else if (cat.parent_id) {
                // Parent might not be in roots yet — find it
                const parent = categories.find((c) => c.id === cat.parent_id);
                if (parent && !parentMap[parent.id]) {
                    parentMap[parent.id] = [];
                }
                if (parentMap[cat.parent_id]) {
                    parentMap[cat.parent_id].push(cat);
                }
            }
        }

        // Flatten to an ordered list: [parent, child, child, parent, child, ...]
        const result = [];
        for (const root of roots) {
            result.push({ ...root, isParent: true });
            const children = parentMap[root.id] || [];
            children.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            for (const child of children) {
                result.push({ ...child, isParent: false });
            }
        }

        return result;
    }, [categories]);

    // Filter categories by search text
    const filteredCategories = useMemo(() => {
        const q = catSearch.trim().toLowerCase();
        if (!q) return categoryTree;
        return categoryTree.filter((cat) => {
            const nameEn = (cat.name_en || '').toLowerCase();
            const nameAr = (cat.name_ar || '').toLowerCase();
            return nameEn.includes(q) || nameAr.includes(q);
        });
    }, [categoryTree, catSearch]);

    // Get current category display name
    const selectedCatName = useMemo(() => {
        if (!categoryFilter) return tp('all_categories');
        const cat = categories.find((c) => c.id === categoryFilter);
        if (!cat) return tp('all_categories');
        return isAr ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar);
    }, [categoryFilter, categories, isAr]);

    return (
        <div className={styles.toolbar}>
            {/* Top row: title + search + actions */}
            <div className={styles.topRow}>
                <div className={styles.leftGroup}>
                    <h2 className={styles.title}>{tp('title')}</h2>

                    {/* Search with suggestions */}
                    <div className={styles.searchBox} ref={searchRef}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => {
                                setLocalSearch(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => localSearch.trim().length >= 2 && setShowSuggestions(true)}
                            placeholder={tp('search_placeholder')}
                            className={styles.searchInput}
                        />
                        {localSearch && (
                            <button
                                className={styles.clearSearch}
                                onClick={() => { setLocalSearch(''); onSearchChange(''); setShowSuggestions(false); }}
                            >
                                <X size={14} />
                            </button>
                        )}

                        {/* Suggestions dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className={styles.suggestionsDropdown}>
                                <span className={styles.suggestionsLabel}>{tp('search_suggestions')}</span>
                                {suggestions.map((s) => (
                                    <button
                                        key={s.id}
                                        className={styles.suggestionItem}
                                        onClick={() => handleSuggestionClick(s)}
                                    >
                                        {s.image && (
                                            <img src={s.image} alt="" className={styles.suggestionImg} />
                                        )}
                                        <div className={styles.suggestionInfo}>
                                            <span className={styles.suggestionLabel}>{s.label}</span>
                                            <span className={styles.suggestionSub}>{s.sublabel}</span>
                                        </div>
                                        {s.price && (
                                            <span className={styles.suggestionPrice}>${Number(s.price).toFixed(2)}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                        {showSuggestions && localSearch.trim().length >= 2 && suggestions.length === 0 && (
                            <div className={styles.suggestionsDropdown}>
                                <span className={styles.noResults}>{tp('search_no_results')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightGroup}>
                    {/* Bulk actions */}
                    {selectedCount > 0 && (
                        <div className={styles.bulkActions}>
                            <ListChecks size={16} />
                            <span className={styles.bulkCount}>{selectedCount} {tp('selected')}</span>
                            <select
                                className={styles.bulkSelect}
                                onChange={(e) => {
                                    if (e.target.value) onBulkAction(e.target.value);
                                    e.target.value = '';
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>{tp('bulk_actions')}</option>
                                <option value="activate">{tp('activate')}</option>
                                <option value="deactivate">{tp('deactivate')}</option>
                                <option value="delete">{tp('delete_selected')}</option>
                            </select>
                        </div>
                    )}

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
                    {/* Searchable Category dropdown */}
                    <div className={styles.catDropdownWrapper} ref={catRef}>
                        <button
                            className={styles.catDropdownBtn}
                            onClick={() => setShowCatDropdown(!showCatDropdown)}
                        >
                            <span className={styles.catDropdownText}>{selectedCatName}</span>
                            <ChevronDown size={14} className={`${styles.catChevron} ${showCatDropdown ? styles.catChevronOpen : ''}`} />
                        </button>

                        {showCatDropdown && (
                            <div className={styles.catDropdown}>
                                {/* Search input inside dropdown */}
                                <div className={styles.catSearchBox}>
                                    <Search size={14} className={styles.catSearchIcon} />
                                    <input
                                        type="text"
                                        value={catSearch}
                                        onChange={(e) => setCatSearch(e.target.value)}
                                        placeholder={tp('cat_search_placeholder')}
                                        className={styles.catSearchInput}
                                        autoFocus
                                    />
                                </div>

                                {/* "All" option */}
                                <button
                                    className={`${styles.catOption} ${!categoryFilter ? styles.catOptionActive : ''}`}
                                    onClick={() => { onCategoryChange(null); setShowCatDropdown(false); setCatSearch(''); }}
                                >
                                    {tp('all_categories')}
                                </button>

                                {/* Category tree */}
                                {filteredCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        className={`${styles.catOption} ${cat.isParent ? styles.catParent : styles.catChild} ${categoryFilter === cat.id ? styles.catOptionActive : ''}`}
                                        onClick={() => { onCategoryChange(cat.id); setShowCatDropdown(false); setCatSearch(''); }}
                                    >
                                        {isAr ? (cat.name_ar || cat.name_en) : (cat.name_en || cat.name_ar)}
                                        {cat.isParent && <span className={styles.catParentBadge}>{tp('cat_parent')}</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

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
