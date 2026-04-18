import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ordersService } from '../services/ordersService';
import { useOrdersStore } from '../store/useOrdersStore';

/**
 * Hook to fetch orders and provide "Smart" client-side filtering.
 */
export const useOrdersQuery = () => {
    const filters = useOrdersStore(state => state.filters);

    const { data: rawOrders = [], isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data, error } = await ordersService.fetchAllOrders();
            if (error) throw error;
            return data || [];
        },
        staleTime: 1000 * 30 // 30 seconds
    });

    const filteredOrders = useMemo(() => {
        return rawOrders.filter(order => {
            const matchesSearch = !filters.search || 
                order.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.phone_number?.includes(filters.search) ||
                order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.Order_items?.some(item => 
                    item.product_id?.toLowerCase().includes(filters.search.toLowerCase())
                );

            const matchesStatus = !filters.status || order.status === filters.status;
            const matchesPayment = !filters.payment || order.payment_method === filters.payment;
            const matchesGov = !filters.governorate || order.governorate_id === Number(filters.governorate);

            return matchesSearch && matchesStatus && matchesPayment && matchesGov;
        });
    }, [rawOrders, filters]);

    return { orders: filteredOrders, rawOrders, isLoading, error };
};
