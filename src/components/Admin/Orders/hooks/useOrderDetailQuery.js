import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../services/ordersService';

/**
 * Hook to fetch deep details of a single order.
 */
export const useOrderDetailQuery = (id) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await ordersService.fetchOrderDetail(id);
            if (error) throw error;
            return data;
        },
        enabled: !!id,
        staleTime: 1000 * 60 // 1 minute
    });
};
