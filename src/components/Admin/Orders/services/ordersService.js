import { supabase } from '../../../../utils/SupabaseClient';

/**
 * Service to handle all Orders related DB operations.
 */
export const ordersService = {
    /**
     * Fetch all orders with client and governorate joins.
     */
    async fetchAllOrders() {
        const { data, error } = await supabase
            .from('Orders')
            .select(`
                *,
                GovernoratesShipping(governorateEn, shippingPrice),
                Clients(fullName, email, phone),
                Order_items(*, Products(id, nameEn, nameAr, images, price, original_price, discount, sales_count, rating, views, stock))
            `)
            .order('created_at', { ascending: false });
        return { data, error };
    },

    /**
     * Fetch a single order with detailed items and product names.
     */
    async fetchOrderDetail(id) {
        const { data, error } = await supabase
            .from('Orders')
            .select(`
                *,
                Clients(*),
                GovernoratesShipping(*),
                Order_items(*, Products(id, nameEn, nameAr, images, stock, price, original_price, discount, sales_count, rating, views))
            `)
            .eq('id', id)
            .single();
        return { data, error };
    },

    /**
     * Update order status.
     * @param {string|string[]} ids - Single ID or array for bulk.
     */
    async updateStatus(ids, newStatus) {
        const query = supabase.from('Orders').update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
        });
        
        if (Array.isArray(ids)) return await query.in('id', ids);
        return await query.eq('id', ids);
    },

    /**
     * Fetch all active carts.
     */
    async fetchCarts() {
        return await supabase
            .from('Carts')
            .select('*, Clients(fullName, email)')
            .order('updated_at', { ascending: false });
    }
};
