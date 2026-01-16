import { useContext, useEffect, useState } from "react";
import { userContext } from "../../utils/AppContexts";
import { useCartActions } from "../../utils/Hooks/useCartActions";
import useRealtimeSubscription from "../../utils/useRealtimeSubscription";
import { supabase } from "../../utils/SupabaseClient";

const useCartDataStorage = () => {
  const contextValue = useContext(userContext);
  const user = Array.isArray(contextValue) ? contextValue[0] : contextValue;
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const { fetchCart } = useCartActions();

  // Fetch cart when user changes or trigger is updated
  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      // Don't fetch if user is not initialized at all (neither client nor guest)
      // But allow fetch if user object exists even if loadingState might be inconsistent - 
      // rely on useCartActions to provide the correct ID.
      if (!user) {
        if (active) setLoading(false);
        return;
      }

      // If we have neither ID, we can't fetch.
      if (!user.id && !user.guest_id) {
        if (active) setLoading(false);
        return;
      }

      console.log("📦 Fetching cart for user:", user.type, user.id || user.guest_id);
      setLoading(true);

      const data = await fetchCart();

      if (!active) return;

      // Store raw cart data
      setCart(data);

      if (!data || !data.items || data.items.length === 0) {
        console.log("🛒 Cart is empty");
        setCartItems([]);
        setTotalPrice(0);
        setLoading(false);
        return;
      }

      const rawItems = data.items;
      const productIds = [...new Set(rawItems.map((item) => item.id))];
      // console.log("🔍 Fetching product details for IDs:", productIds);

      // Fetch product details
      const { data: products, error } = await supabase
        .from("Products")
        .select("id, nameEn, nameAr, price, images, is_active")
        .in("id", productIds);

      if (error) {
        console.error("❌ Error fetching product details:", error);
        if (active) setLoading(false);
        return;
      }

      // Merge cart items with product details
      const hydratedItems = rawItems
        .map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id);
          if (!product) return null; // Product might be deleted

          return {
            ...cartItem, // qty, color, size
            product, // name, price, images
          };
        })
        .filter(Boolean); // Remove nulls

      // Calculate Total
      const total = hydratedItems.reduce((acc, item) => {
        return acc + item.product.price * item.qty;
      }, 0);

      if (active) {
        setCartItems(hydratedItems);
        setTotalPrice(total);
        setLoading(false);
      }
    };

    loadCart();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.guest_id, trigger, fetchCart]); // Added fetchCart to dependencies logic

  // Robust owner-based realtime subscription
  const ownerFilter = user?.id
    ? `client_id=eq.${user.id}`
    : user?.guest_id
      ? `guest_id=eq.${user.guest_id}`
      : null;

  useRealtimeSubscription(
    ownerFilter ? `user-cart-${user.id || user.guest_id}` : null,
    "Carts",
    ownerFilter,
    (payload) => {
      console.log("Real-time cart update received for owner:", payload);
      // Trigger a refetch on any change (insert, update, delete)
      setTrigger((prev) => prev + 1);
    }
  );

  const refreshCart = () => {
    setTrigger((prev) => prev + 1);
  };

  return {
    cart,
    setCart,
    cartItems,
    loading,
    totalPrice,
    refreshCart
  };
};

export default useCartDataStorage;
