import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '../../../../utils/SupabaseClient';
import { useOrdersStore } from '../store/useOrdersStore';

export const useCartsQuery = () => {
    const filters = useOrdersStore(state => state.filters);

    const { data: rawCarts = [], isLoading, error } = useQuery({
        queryKey: ['carts'],
        queryFn: async () => {
            const { data: carts, error: cartsError } = await supabase
                .from('Carts')
                .select('*, Clients(fullName, phone, email, address, "governorateId", "nickName", "avatarUrl")')
                .order('updated_at', { ascending: false });

            if (cartsError) throw cartsError;

            const productIds = [...new Set(carts.flatMap(cart => 
                cart.items?.map(i => i.product_id || i.productId || i.id) || []
            ))].filter(Boolean);
            
            const { data: products } = await supabase
                .from('Products')
                .select('*') // Fetching all columns to include profit
                .in('id', productIds);

            const productMap = Object.fromEntries(products?.map(p => [p.id, p]) || []);

            return carts.map(cart => {
                const resolvedItems = (cart.items || []).map(item => {
                    const pId = item.product_id || item.productId || item.id;
                    const product = productMap[pId];
                    return { ...item, product, quantity: item.quantity || 1, price: item.price || product?.price || 0 };
                });
                
                const totalValue = resolvedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
                const totalProfit = resolvedItems.reduce((sum, i) => sum + ((i.product?.profit || 0) * i.quantity), 0);
                
                return { ...cart, resolvedItems, totalValue, totalProfit };
            });
        }
    });

    const enrichedResults = useMemo(() => {
        let filtered = [...rawCarts];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            filtered = filtered.filter(c => 
                c.Clients?.fullName?.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.Clients?.email?.toLowerCase().includes(q)
            );
        }

        if (filters.clientType !== 'all') {
            filtered = filtered.filter(c => filters.clientType === 'guest' ? !c.client_id : !!c.client_id);
        }

        if (filters.minPrice > 0) filtered = filtered.filter(c => c.totalValue >= filters.minPrice);
        if (filters.maxPrice) filtered = filtered.filter(c => c.totalValue <= filters.maxPrice);

        const stats = {
            totalCarts: filtered.length,
            potentialRevenue: filtered.reduce((sum, c) => sum + c.totalValue, 0),
            recoverable: filtered.filter(c => c.Clients?.phone).length,
            guestCount: filtered.filter(c => !c.client_id).length
        };

        if (filters.cartSort === 'value') filtered.sort((a, b) => b.totalValue - a.totalValue);
        if (filters.cartSort === 'items') filtered.sort((a, b) => (b.items?.length || 0) - (a.items?.length || 0));

        return { carts: filtered, stats };
    }, [rawCarts, filters]);

    return { ...enrichedResults, isLoading, error };
};
