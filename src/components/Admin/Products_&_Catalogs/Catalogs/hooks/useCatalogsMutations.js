import { supabase } from '../../../../../utils/SupabaseClient';

/**
 * Custom hook to handle Catalogs/Categories mutation operations.
 */
export const useCatalogsMutations = (fetchCategories, setCategories) => {
    
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
        setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
        const { error } = await supabase.from('Categories').update({ is_active: !currentStatus }).eq('id', id);
        if (error) {
            setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: currentStatus } : c));
            throw error;
        }
    };

    const updateSortOrders = async (reorderedArray) => {
        setCategories(prev => {
            const map = new Map(reorderedArray.map(i => [i.id, i.sort_order]));
            return prev.map(c => map.has(c.id) ? { ...c, sort_order: map.get(c.id) } : c);
        });
        for (const item of reorderedArray) {
            await supabase.from('Categories').update({ sort_order: item.sort_order }).eq('id', item.id);
        }
        await fetchCategories();
    };

    return { addCategory, updateCategory, deleteCategory, toggleActiveStatus, updateSortOrders };
};
