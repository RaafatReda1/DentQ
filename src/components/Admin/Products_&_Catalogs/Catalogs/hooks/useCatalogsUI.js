import { useState, useMemo } from 'react';
import { flatToTree } from '../lib/catalogHelpers';

/**
 * Custom hook to manage the UI state and filtering logic for Catalogs.
 */
export const useCatalogsUI = (categories) => {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ level: 'all', status: 'all' });
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [inlineParentId, setInlineParentId] = useState(null);

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
            result = result.filter(c => c.is_active === (filters.status === 'active'));
        }
        return result;
    }, [categories, search, filters]);

    const tree = useMemo(() => flatToTree(filteredCats), [filteredCats]);

    const toggleExpand = (id) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return {
        search, setSearch,
        filters, setFilters,
        expandedIds, setExpandedIds,
        inlineParentId, setInlineParentId,
        filteredCats,
        tree,
        toggleExpand
    };
};
