import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../../../utils/SupabaseClient';

/**
 * Custom hook for managing Catalogs/Categories state with Supabase.
 * Handles fetching, creating, updating, deleting (with cascade awareness), and basic filtering.
 */
export const useCatalogs = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        // Attempting to select product counts (optional schema dependency, handled gracefully)
        const { data, error: fetchError } = await supabase
            .from('Categories')
            .select(`
                *,
                Products: Products(count)
            `)
            .order('sort_order', { ascending: true });

        if (fetchError) {
            // Fallback if Products relation is differently named
            if (fetchError.message.includes('relation "Products" does not exist') || fetchError.code === 'PGRST200') {
                const fallback = await supabase.from('Categories').select('*').order('sort_order', { ascending: true });
                if (fallback.error) setError(fallback.error.message);
                else setCategories(fallback.data || []);
            } else {
                setError(fetchError.message);
            }
        } else {
            // Map count purely
            const formatted = data?.map(c => ({
                ...c,
                productCount: c.Products?.[0]?.count || 0
            })) || [];
            setCategories(formatted);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = async (categoryObj) => {
        const { data, error } = await supabase.from('Categories').insert(categoryObj).select();
        if (error) throw error;
        await fetchCategories();
        return data;
    };

    const updateCategory = async (id, updates) => {
        const { data, error } = await supabase.from('Categories').update(updates).eq('id', id).select();
        if (error) throw error;
        await fetchCategories();
        return data;
    };

    const deleteCategory = async (id) => {
        const { error } = await supabase.from('Categories').delete().eq('id', id);
        if (error) throw error;
        await fetchCategories();
    };

    const toggleActiveStatus = async (id, currentStatus) => {
        // Optimistic update
        setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
        const { error } = await supabase.from('Categories').update({ is_active: !currentStatus }).eq('id', id);
        if (error) {
            // Revert on error
            setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: currentStatus } : c));
            throw error;
        }
    };

    const updateSortOrders = async (reorderedArray) => {
        // reorderedArray: [{id, sort_order}]
        // Optimistic
        setCategories(prev => {
            const map = new Map(reorderedArray.map(i => [i.id, i.sort_order]));
            return prev.map(c => map.has(c.id) ? { ...c, sort_order: map.get(c.id) } : c);
        });

        // Batch upsert or individual updates
        // Supabase standard `upsert` requires all primary/not_null keys, often bulk-update is done via RPC or loop
        for (const item of reorderedArray) {
            await supabase.from('Categories').update({ sort_order: item.sort_order }).eq('id', item.id);
        }
        await fetchCategories();
    };

    return {
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleActiveStatus,
        updateSortOrders
    };
};
