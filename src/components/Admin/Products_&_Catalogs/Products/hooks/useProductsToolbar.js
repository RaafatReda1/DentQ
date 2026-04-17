import { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to manage the business logic for the ProductsToolbar.
 */
export const useProductsToolbar = ({
    searchTerm,
    onSearchChange,
    categories,
    allProducts,
    categoryFilter,
    onCategoryChange
}) => {
    const { t, i18n } = useTranslation();
    const tp = (key) => t(`admin.products.${key}`);
    const isAr = i18n.language === 'ar';

    // --- Search state ---
    const [localSearch, setLocalSearch] = useState(searchTerm);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // --- Category dropdown state ---
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [catSearch, setCatSearch] = useState('');
    const catRef = useRef(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => onSearchChange(localSearch), 300);
        return () => clearTimeout(timer);
    }, [localSearch, onSearchChange]);

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

    // --- Smart search suggestions ---
    const suggestions = useMemo(() => {
        const q = localSearch.trim().toLowerCase();
        if (!q || q.length < 2) return [];

        const results = [];
        const seen = new Set();

        // 1. Match product names
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

        // 3. Match price patterns
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
    }, [localSearch, allProducts, categories, isAr, tp]);

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

    // --- Build hierarchical category tree ---
    const categoryTree = useMemo(() => {
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
                const parent = categories.find((c) => c.id === cat.parent_id);
                if (parent && !parentMap[parent.id]) {
                    parentMap[parent.id] = [];
                }
                if (parentMap[cat.parent_id]) {
                    parentMap[cat.parent_id].push(cat);
                }
            }
        }

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
    }, [categoryFilter, categories, isAr, tp]);

    return {
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
        tp,
        isAr
    };
};
