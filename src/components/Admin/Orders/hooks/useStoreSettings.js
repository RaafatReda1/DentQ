import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../utils/SupabaseClient';

export const useStoreSettings = () => {
    return useQuery({
        queryKey: ['storeSettings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('StoreSettings')
                .select('*')
                .limit(1)
                .single();
                
            if (error && error.code !== 'PGRST116') {
                console.error("Error fetching store settings:", error);
                throw error;
            }
            return data || null;
        },
        staleTime: 1000 * 60 * 5 // 5 minutes
    });
};
