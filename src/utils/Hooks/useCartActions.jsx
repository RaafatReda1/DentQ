import { useContext, useCallback } from "react";
import toast from "react-hot-toast";
import { supabase } from "../SupabaseClient";
import { userContext } from "../AppContexts"; // افترض عندك UserContext

import { isSameVariant } from "../isSameVariant";

/* =========================
   Hook: Get Owner Info (client_id / guest_id)
========================= */
const useOwnerInfo = () => {
  const [user] = useContext(userContext);
  console.log("DEBUG: UserContext value:", user); // Debug log

  if (!user) return { ownerId: null, ownerField: null };

  if (user.type === "client")
    return { ownerId: user.id, ownerField: "client_id" };
  if (user.type === "guest")
    return { ownerId: user.guest_id, ownerField: "guest_id" };

  return { ownerId: null, ownerField: null };
};

/* =========================
   Add / Upsert Product to Cart
========================= */
/**
 * useCartActions Hook
 * 
 * Provides methods to interact with the Cart in the database (Supabase).
 * Handles adding, removing, and updating quantities of products.
 * 
 * Key Features:
 * - Automatically detects if user is Client or Guest.
 * - Updates the 'Carts' table in Supabase.
 * - Triggers a full app reload (forceRerender) when creating a new cart to ensure state synchronization.
 */
export const useCartActions = () => {
  const { ownerId, ownerField } = useOwnerInfo();

  /**
   * Fetches the current user's cart from Supabase.
   * Memoized with useCallback to be safe for dependency arrays.
   */
  const fetchCart = useCallback(async () => {
    // ... code ...
    if (!ownerId || !ownerField) return null;

    const { data, error } = await supabase
      .from("Carts")
      .select("*")
      .eq(ownerField, ownerId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart");
      return null;
    }

    return data;
  }, [ownerId, ownerField]);

  /**
   * Adds a product to the cart or updates its quantity if it already exists.
   * @param {Object} currentProduct - The product object to add.
   * @param {boolean} singleIncrease - If true, increments qty by 1 only.
   */
  const addToCart = useCallback(
    async (currentProduct, singleIncrease) => {
      //if we passed singleIncrease with true it willonly add 1 to that specific product
      if (!ownerId || !ownerField) {
        console.error("DEBUG: Missing owner info, cannot add to cart.");
        return false;
      }

      const { id, color, size, qty } = currentProduct;
      // Create a minimal object with only necessary identifying fields
      const productToAdd = {
        id,
        qty: qty && !singleIncrease ? qty : 1,
        ...(color !== undefined && { color }),
        ...(size !== undefined && { size }),
      };

      let ownerCart = await fetchCart();

      // CASE 1: No Cart Exists - Create New Cart
      if (!ownerCart) {
        const { error } = await supabase.from("Carts").insert({
          [ownerField]: ownerId,
          items: [productToAdd],
        });

        if (error) {
          console.error("Error creating cart:", error);
          toast.error("Failed to add to cart");
          return false;
        }

        toast.success("Added to cart");

        // Trigger app reload logic for the very first cart creation
        // This ensures the global app state (likely provided by Context) realizes the cart exists immediately
        if (window.forceRerender) {
          window.forceRerender();
        }

        return true;
      }

      // CASE 2: Cart Exists - Update Items
      const items = [...ownerCart.items];
      const wasEmpty = items.length === 0; // Check if it was empty before adding

      const index = items.findIndex((item) =>
        isSameVariant(item, productToAdd)
      );

      if (index !== -1) {
        items[index] = {
          ...items[index],
          qty: items[index].qty + productToAdd.qty,
        };
      } else {
        items.push(productToAdd);
      }

      const { error } = await supabase
        .from("Carts")
        .update({ items })
        .eq("id", ownerCart.id);

      if (error) {
        console.error("Error updating cart:", error);
        toast.error("Failed to update cart");
        return false;
      }

      toast.success("Cart updated successfully");

      // If the cart was effectively empty (items: []), adding an item is like creating a new cart.
      // Trigger reload to ensure sync.
      if (wasEmpty && window.forceRerender) {
        window.forceRerender();
      }

      return true;
    },
    [ownerId, ownerField, fetchCart]
  );

  /**
   * Decreases the quantity of a product in the cart.
   * Removes the product if quantity reaches 0.
   */
  const decreaseCartQty = useCallback(
    async (product) => {
      if (!ownerId || !ownerField) return;

      let ownerCart = await fetchCart();
      if (!ownerCart) return;

      const items = [...ownerCart.items];
      const index = items.findIndex((item) => isSameVariant(item, product));
      if (index === -1) return;

      if (items[index].qty > 1) {
        items[index].qty -= 1;
      } else {
        items.splice(index, 1);
      }

      const { error } = await supabase
        .from("Carts")
        .update({ items })
        .eq("id", ownerCart.id);

      if (error) {
        console.error("Error decreasing product qty:", error);
        toast.error("Failed to update cart");
        return 0;
      }

      toast.success("Cart updated successfully");
    },
    [ownerId, ownerField, fetchCart]
  );

  /**
   * Removes a product completely from the cart.
   */
  const deleteProductFromCart = useCallback(
    async (product) => {
      if (!ownerId || !ownerField) return;

      let ownerCart = await fetchCart();
      if (!ownerCart) return;

      const items = [...ownerCart.items];
      const index = items.findIndex((item) => isSameVariant(item, product));
      if (index === -1) return;

      items.splice(index, 1);

      const { error } = await supabase
        .from("Carts")
        .update({ items })
        .eq("id", ownerCart.id);

      if (error) {
        console.error("Error deleting product from cart:", error);
        toast.error("Failed to update cart");
        return;
      }

      toast.success("Product removed from cart");
    },
    [ownerId, ownerField, fetchCart]
  );

  return { addToCart, decreaseCartQty, deleteProductFromCart, fetchCart };
};

// 🔹 How to Use in Components
// 1️⃣ Add to cart button (default qty 1)
// const { addToCart } = useCartActions();

// <button onClick={() => addToCart(product)}>
//   Add to Cart
// </button>

// 2️⃣ + Button (increase qty by 1)
// <button onClick={() => addToCart({ ...product, qty: 1 })}>+</button>

// 3️⃣ - Button (decrease qty by 1)
// const { decreaseCartQty } = useCartActions();

// <button onClick={() => decreaseCartQty({ ...product, qty: 1 })}>-</button>

// 4️⃣ Delete product completely
// const { deleteProductFromCart } = useCartActions();

// <button onClick={() => deleteProductFromCart(product)}>Remove</button>

// 5️⃣ Add from ProductPage (custom qty from state)
// <button onClick={() => addToCart({ ...product, qty: quantityFromState })}>
//   Add {quantityFromState} to Cart
// </button>
