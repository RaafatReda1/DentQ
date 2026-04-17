import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../../../utils/SupabaseClient';

/**
 * Custom hook to handle loading Catalogs/Categories data.
 */
export const useCatalogsLoad = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        const { data, error: fetchError } = await supabase
            .from('Categories')
            .select('*, Products: Products(count)')
            .order('sort_order', { ascending: true });

        if (fetchError) {
            handleFetchError(fetchError, setCategories, setError);
        } else {
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

    return { categories, setCategories, loading, error, fetchCategories };
};

const handleFetchError = async (error, setCategories, setError) => {
    if (error.message.includes('relation "Products"')) {
        const fallback = await supabase.from('Categories').select('*').order('sort_order', { ascending: true });
        if (fallback.error) setError(fallback.error.message);
        else setCategories(fallback.data || []);
    } else {
        setError(error.message);
    }
};
