import toast from "react-hot-toast";
import { applyPromoCode } from "../../../utils/CheckPromoCodeValidity";
import { supabase } from "../../../utils/SupabaseClient";

/**
 * Fetch all governorates for shipping
 */
export const fetchGovernorates = async () => {
    const { data, error } = await supabase
        .from("GovernoratesShipping")
        .select("*")
        .order("governorateEn", { ascending: true });

    if (error) {
        console.error("Error fetching governorates:", error);
        return [];
    }
    return data;
};

/**
 * Calculate shipping fee based on governorate ID
 */
export const calculateShipping = (governorateId, governorates) => {
    if (!governorateId || !governorates) return 0;

    const governorate = governorates.find(
        (g) => g.id === parseInt(governorateId)
    );
    return governorate ? governorate.shippingPrice : 0;
};

//Conifrm Order Action

export const confirmOrder = async (FormData, cartItems) => {
    if (FormData.promocode_id) {
        await applyPromoCode(
            FormData.promocode_id,
            FormData.client_id || FormData.guest_id
        );
    }
    const orderId = crypto.randomUUID();
    const { data, error } = await supabase
        .from("Orders")
        .insert({ ...FormData, status: "pending", id: orderId });
    if (error) {
        console.error(error);
        return [];
    } else {
        toast.success("Order confirmed!");
    }
    // Prepare order items
    if (cartItems && cartItems.length > 0) {
        const orderItems = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.id, // item.id matches the product ID in raw items
            quantity: item.qty,
            price: item.product.price, // stored in product object
            color: item.color,
            size: item.size
        }));

        // Upload order items
        const { error: itemsError } = await supabase
            .from("Order_items")
            .insert(orderItems);

        if (itemsError) {
            console.error("Error inserting order items:", itemsError);
            toast.error("Error processing order items");
            // Optionally: Delete the created order to maintain consistency
            return false;
        }

        // Clear user's cart by emptying items array (better for realtime updates)
        const userId = FormData.client_id;
        const guestId = FormData.guest_id;

        let query = supabase.from("Carts").update({ items: [] });

        if (userId) {
            query = query.eq("client_id", userId);
        } else if (guestId) {
            query = query.eq("guest_id", guestId);
        }

        const { error: clearError } = await query;

        if (clearError) {
            console.error("Error clearing cart:", clearError);
            // Non-critical error, order is already successful
        }
    }
    window.forceRerender();

    return true;
};
