import { GetCookie, DeleteCookie } from "./GuestIdCookie";
import { supabase } from "./SupabaseClient";

// Lock to prevent concurrent transfers
let isTransferring = false;

/**
 * Transfer guest orders to client account when user signs in
 * @param {string} clientId - The client ID to transfer orders to
 */
export const transferGuestOrders = async (clientId) => {
    if (isTransferring) {
        console.log("⏳ Orders transfer already in progress. Skipping duplicate call.");
        return;
    }

    const guestId = GetCookie();
    if (!guestId) return;

    isTransferring = true;

    try {
        console.log(`📦 Found guest_id cookie: ${guestId}. Attempting to transfer orders to Client ${clientId}...`);

        // 1. Fetch all guest orders
        const { data: guestOrders, error: fetchError } = await supabase
            .from("Orders")
            .select("*")
            .eq("guest_id", guestId);

        if (fetchError) throw fetchError;

        if (!guestOrders || guestOrders.length === 0) {
            console.log("📭 No guest orders found.");
            return;
        }

        console.log(`📦 Found ${guestOrders.length} guest order(s). Transferring...`);

        // 2. Transfer all guest orders to client account
        const { error: updateError } = await supabase
            .from("Orders")
            .update({
                guest_id: null,
                client_id: clientId
            })
            .eq("guest_id", guestId);

        if (updateError) throw updateError;

        console.log(`✅ Successfully transferred ${guestOrders.length} order(s) to client account.`);

        // Note: We don't delete the cookie here since cart transfer will do it
        // This prevents issues if cart transfer runs after orders transfer
    } catch (error) {
        console.error("❌ Error transferring orders:", error);
    } finally {
        isTransferring = false;
    }
};
