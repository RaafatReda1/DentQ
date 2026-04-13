import { supabase } from '../utils/SupabaseClient';

/**
 * Fetches all categories sorted by sort_order.
 * Returns hierarchical aware data.
 */
export const fetchCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('Categories')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("Categories Fetch Error:", error);
        return { data: null, error };
    }
};

/**
 * Creates a new category.
 */
export const createCategory = async (categoryData) => {
    try {
        // Auto-generate slug if not provided
        if (!categoryData.slug && categoryData.name_en) {
            categoryData.slug = categoryData.name_en.toLowerCase().replace(/\s+/g, '-');
        }

        const { data, error } = await supabase
            .from('Categories')
            .insert([categoryData])
            .select();

        if (error) throw error;
        return { data: data[0], error: null };
    } catch (error) {
        console.error("Category Create Error:", error);
        return { data: null, error };
    }
};

/**
 * Updates an existing category by ID.
 */
export const updateCategory = async (id, updates) => {
    try {
        // Re-generate slug safely if name_en changes
        if (updates.name_en && !updates.slug) {
            updates.slug = updates.name_en.toLowerCase().replace(/\s+/g, '-');
        }

        const { data, error } = await supabase
            .from('Categories')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return { data: data[0], error: null };
    } catch (error) {
        console.error("Category Update Error:", error);
        return { data: null, error };
    }
};

/**
 * Deletes a category. 
 * Warning: You should restrict deletion if child categories or products are linked.
 */
export const deleteCategory = async (id) => {
    try {
        const { data, error } = await supabase
            .from('Categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("Category Delete Error:", error);
        return { data: null, error };
    }
};

/**
 * Batch updates sort_order for drag-and-drop operations.
 * Requires an array of { id, sort_order }.
 */
export const updateCategoriesOrder = async (orderedItems) => {
    try {
        // Supabase RPG/RPC would be faster, but mapping individual updates works for smaller trees
        const promises = orderedItems.map((item) => 
            supabase.from('Categories').update({ sort_order: item.sort_order }).eq('id', item.id)
        );
        
        await Promise.all(promises);
        return { success: true, error: null };
    } catch (error) {
        console.error("Order Update Error:", error);
        return { success: false, error };
    }
};
