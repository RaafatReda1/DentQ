import { create } from 'zustand';

/**
 * Global store for Orders Management UI state.
 * Syncs filters, view modes, and selection across Table, Kanban, and Detail views.
 */
export const useOrdersStore = create((set) => ({
    activeView: 'table', // 'table' | 'kanban' | 'detail' | 'carts'
    selectedIds: new Set(),
    activeOrderId: null,
    
    filters: {
        search: '',
        status: '',
        payment: '',
        governorate: '',
        dateFrom: '',
        dateTo: '',
        minPrice: 0,
        maxPrice: null,
        clientType: 'all', // 'all' | 'guest' | 'registered'
    },

    setView: (view) => set({ activeView: view }),
    
    toggleSelect: (id) => set((state) => {
        const next = new Set(state.selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return { selectedIds: next };
    }),

    selectAll: (ids) => set({ selectedIds: new Set(ids) }),
    clearSelection: () => set({ selectedIds: new Set() }),

    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),

    resetFilters: () => set({
        filters: { 
            search: '', status: '', payment: '', governorate: '', 
            dateFrom: '', dateTo: '', minPrice: 0, maxPrice: null, clientType: 'all' 
        }
    }),

    setActiveOrder: (id) => set({ activeOrderId: id }),
}));
