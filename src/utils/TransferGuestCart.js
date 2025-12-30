import { DeleteCookie, GetCookie } from "./GuestIdCookie";
import { supabase } from "./SupabaseClient";
import { isSameVariant } from "./isSameVariant";

// Lock to prevent concurrent transfers (common in React StrictMode)
let isTransferring = false;

/* =========================
   Helper: Transfer Guest Cart
========================= */
export const transferGuestCart = async (clientId) => {
  if (isTransferring) {
    console.log("⏳ Cart transfer already in progress. Skipping duplicate call.");
    return;
  }

  const guestId = GetCookie();
  if (!guestId) return;

  isTransferring = true;

  try {
    console.log(`🛒 Found guest_id cookie: ${guestId}. Attempting to transfer cart to Client ${clientId}...`);

    // 1. Fetch Guest Cart
    const { data: guestCart } = await supabase
      .from("Carts")
      .select("*")
      .eq("guest_id", guestId)
      .maybeSingle();

    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      console.log("📭 Guest cart is empty or doesn't exist.");
      if (guestCart) await supabase.from("Carts").delete().eq("id", guestCart.id);
      DeleteCookie();
      return;
    }

    // 2. Fetch Client Cart
    const { data: clientCart } = await supabase
      .from("Carts")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    let finalItems = [...guestCart.items];

    if (clientCart && clientCart.items?.length > 0) {
      console.log("🔄 Client already has a cart. Merging items...");

      // Merge items from guest cart into client cart
      const merged = [...clientCart.items];

      guestCart.items.forEach(gItem => {
        const index = merged.findIndex(cItem => isSameVariant(cItem, gItem));

        if (index !== -1) {
          // Found match: update quantity
          merged[index] = {
            ...merged[index],
            qty: merged[index].qty + gItem.qty
          };
          console.log(`➕ Merged qty for product ${gItem.id}. New qty: ${merged[index].qty}`);
        } else {
          // No match: add as new item
          merged.push(gItem);
          console.log(`🆕 Added new item ${gItem.id} to cart.`);
        }
      });
      finalItems = merged;

      // 3. Update Client Cart
      const { error: updateError } = await supabase
        .from("Carts")
        .update({ items: finalItems })
        .eq("id", clientCart.id);

      if (updateError) throw updateError;

      // 4. Delete Guest Cart
      await supabase.from("Carts").delete().eq("id", guestCart.id);
    } else {
      // 5. Transfer Guest Cart to Client (Move)
      const { error: moveError } = await supabase
        .from("Carts")
        .update({
          guest_id: null,
          client_id: clientId
        })
        .eq("id", guestCart.id);

      if (moveError) throw moveError;
    }

    console.log("✅ Cart transfer/merge completed successfully.");
    DeleteCookie();
  } catch (error) {
    console.error("❌ Error transferring cart:", error);
  } finally {
    isTransferring = false;
  }
};
