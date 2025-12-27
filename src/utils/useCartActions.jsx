import { useContext } from "react";
import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { UserContext } from "../contexts/UserContext"; // افترض عندك UserContext

/* =========================
   Helper: Compare Variants
========================= */
const isSameVariant = (item, product) => {
  return Object.keys(product).every((key) => {
    if (key === "qty") return true;
    return item[key] === product[key];
  });
};

/* =========================
   Hook: Get Owner Info (client_id / guest_id)
========================= */
const useOwnerInfo = () => {
  const { user } = useContext(UserContext);

  if (!user) return { ownerId: null, ownerField: null };

  if (user.type === "client") return { ownerId: user.id, ownerField: "client_id" };
  if (user.type === "guest") return { ownerId: user.guest_id, ownerField: "guest_id" };

  return { ownerId: null, ownerField: null };
};

/* =========================
   Add / Upsert Product to Cart
========================= */
export const useCartActions = () => {
  const { ownerId, ownerField } = useOwnerInfo();

  const fetchCart = async () => {
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
  };

  const addToCart = async (currentProduct) => {
    if (!ownerId || !ownerField) return;

    const productToAdd = { ...currentProduct, qty: currentProduct.qty ?? 1 };
    let ownerCart = await fetchCart();

    if (!ownerCart) {
      const { error } = await supabase.from("Carts").insert({
        [ownerField]: ownerId,
        items: [productToAdd],
      });

      if (error) {
        console.error("Error creating cart:", error);
        toast.error("Failed to add to cart");
        return;
      }

      toast.success("Added to cart");
      return;
    }

    const items = [...ownerCart.items];
    const index = items.findIndex((item) => isSameVariant(item, productToAdd));

    if (index !== -1) {
      items[index] = { ...items[index], qty: items[index].qty + productToAdd.qty };
    } else {
      items.push(productToAdd);
    }

    const { error } = await supabase.from("Carts").update({ items }).eq("id", ownerCart.id);

    if (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
      return;
    }

    toast.success("Cart updated successfully");
  };

  const decreaseCartQty = async (product) => {
    if (!ownerId || !ownerField) return;

    let ownerCart = await fetchCart();
    if (!ownerCart) return;

    const items = [...ownerCart.items];
    const index = items.findIndex((item) => isSameVariant(item, product));
    if (index === -1) return;

    if (items[index].qty > 1) {
      items[index].qty -= product.qty ?? 1;
    } else {
      items.splice(index, 1);
    }

    const { error } = await supabase.from("Carts").update({ items }).eq("id", ownerCart.id);

    if (error) {
      console.error("Error decreasing product qty:", error);
      toast.error("Failed to update cart");
      return;
    }

    toast.success("Cart updated successfully");
  };

  const deleteProductFromCart = async (product) => {
    if (!ownerId || !ownerField) return;

    let ownerCart = await fetchCart();
    if (!ownerCart) return;

    const items = [...ownerCart.items];
    const index = items.findIndex((item) => isSameVariant(item, product));
    if (index === -1) return;

    items.splice(index, 1);

    const { error } = await supabase.from("Carts").update({ items }).eq("id", ownerCart.id);

    if (error) {
      console.error("Error deleting product from cart:", error);
      toast.error("Failed to update cart");
      return;
    }

    toast.success("Product removed from cart");
  };

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