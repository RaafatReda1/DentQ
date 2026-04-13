import { supabase } from '../utils/SupabaseClient';

/**
 * Fetches products with pagination and deep sub-table joins (Category).
 */
export const fetchProducts = async ({ page = 0, limit = 20, searchTerm = '', categoryId = null } = {}) => {
    try {
        let query = supabase
            .from('Products')
            .select(`
                *,
                Categories(name_en, name_ar)
            `, { count: 'exact' });

        // Apply filters
        if (searchTerm) {
            query = query.ilike('name_en', `%${searchTerm}%`);
        }
        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        // Apply pagination
        const from = page * limit;
        const to = from + limit - 1;
        
        query = query.range(from, to).order('created_at', { ascending: false });

        const { data, error, count } = await query;
        
        if (error) throw error;
        return { data, count, error: null };
    } catch (error) {
        console.error("Products Fetch Error:", error);
        return { data: null, count: 0, error };
    }
};

/**
 * Creates a product with proper JSONB handling.
 */
export const createProduct = async (productData) => {
    try {
        // Auto-generate slug
        if (!productData.slug && productData.name_en) {
            productData.slug = productData.name_en.toLowerCase().replace(/\s+/g, '-');
        }

        const { data, error } = await supabase
            .from('Products')
            .insert([productData])
            .select();

        if (error) throw error;
        return { data: data[0], error: null };
    } catch (error) {
        console.error("Product Create Error:", error);
        return { data: null, error };
    }
};

/**
 * Updates a product completely or partially (e.g. toggling is_active)
 */
export const updateProduct = async (id, updates) => {
    try {
        // Safe slug update
        if (updates.name_en && !updates.slug) {
            updates.slug = updates.name_en.toLowerCase().replace(/\s+/g, '-');
        }

        const { data, error } = await supabase
            .from('Products')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return { data: data[0], error: null };
    } catch (error) {
        console.error("Product Update Error:", error);
        return { data: null, error };
    }
};

/**
 * Fast-path toggle for is_active, is_featured, is_trending directly from the Data Grid without loading full form.
 */
export const toggleProductStatus = async (id, fieldName, currentStatus) => {
    try {
        const { error } = await supabase
            .from('Products')
            .update({ [fieldName]: !currentStatus })
            .eq('id', id);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error(`Toggle ${fieldName} Error:`, error);
        return { success: false, error };
    }
};

/**
 * Handle deletion. Requires removing DB row.
 * Optionally, you'd trigger a bucket image cleanup hook here.
 */
export const deleteProduct = async (id) => {
    try {
        const { data, error } = await supabase
            .from('Products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error("Product Delete Error:", error);
        return { data: null, error };
    }
};
