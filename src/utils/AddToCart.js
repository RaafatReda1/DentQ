import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
//والله يصاحبي انا اللي عامل اللوجيك كله بس بوريه لشات سبلي وقالي مليان باجز ف شالها وشال كل الكومنتس اللي كنت عاملها ونضف الدنيا ورش مياه

const AddToCart = async (currentProduct, clientId, guestId) => {
  const ownerField = clientId ? "client_id" : "guest_id";
  const ownerId = clientId || guestId;

  let ownerCart = null;

  /* =========================
     0️⃣ Normalize product (ensure qty)
  ========================= */
  const productToAdd = {
    ...currentProduct,
    qty: currentProduct.qty ?? 1,
  };

  /* =========================
     1️⃣ Fetch cart
  ========================= */
  const fetchCart = async () => {
    const { data, error } = await supabase
      .from("Carts")
      .select("*")
      .eq(ownerField, ownerId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching cart:", error);
      return null;
    }

    return data;
  };

  ownerCart = await fetchCart();

  /* =========================
     2️⃣ Variant comparison
  ========================= */
  const isSameVariant = (item, product) => {
    return Object.keys(product).every((key) => {
      if (key === "qty") return true;
      return item[key] === product[key];
    });
  };

  /* =========================
     3️⃣ Create cart if not exists
  ========================= */
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

  /* =========================
     4️⃣ Upsert cart item
  ========================= */
  const items = [...ownerCart.items];

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

  /* =========================
     5️⃣ Update cart in DB
  ========================= */
  const { error } = await supabase
    .from("Carts")
    .update({ items })
    .eq("id", ownerCart.id);

  if (error) {
    console.error("Error updating cart:", error);
    toast.error("Failed to update cart");
    return;
  }

  toast.success("Cart updated successfully");
};

export default AddToCart;
