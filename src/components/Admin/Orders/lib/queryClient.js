import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient configuration for the Orders module.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30000, // 30 seconds
            refetchOnWindowFocus: false,
        },
    },
});
