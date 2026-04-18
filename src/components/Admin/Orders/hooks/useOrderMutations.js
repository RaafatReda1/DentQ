import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ordersService } from '../services/ordersService';
import { useOrdersStore } from '../store/useOrdersStore';

/**
 * Atomic hook for status updates (single & bulk).
 */
export const useOrderMutations = () => {
    const queryClient = useQueryClient();
    const clearSelection = useOrdersStore(state => state.clearSelection);

    return useMutation({
        mutationFn: async ({ id, status }) => {
            const { error } = await ordersService.updateStatus(id, status);
            if (error) throw error;
            return { id, status };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            if (data.id) queryClient.invalidateQueries({ queryKey: ['order', data.id] });
            
            if (Array.isArray(data.id)) clearSelection();
            toast.success(`Status updated to ${data.status}`);
        },
        onError: () => toast.error('Failed to update status. Try again.')
    });
};
