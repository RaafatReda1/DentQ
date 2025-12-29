import { useState, useEffect, useContext } from "react";
import { supabase } from "../../../../utils/SupabaseClient";
import { useCartActions } from "../../../../utils/Hooks/useCartActions";
import { userContext } from "../../../../utils/AppContexts";
import useRealtimeSubscription from "../../../../utils/useRealtimeSubscription";

export const useCartData = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const { fetchCart } = useCartActions();
  const [user] = useContext(userContext);
  const [trigger, setTrigger] = useState(0);

  useRealtimeSubscription(
    'CartChangesChannel',
    'Carts',
    user.id? `client_id=eq.${user.id}` : `guest_id=eq.${user.guest_id}`,
    (payload) => {
      console.log('Real-time update received:', payload.new);
      setTrigger((prev) => prev + 1);
    },
    'UPDATE'
  )
  const refreshCart = () => {
    setTrigger((prev) => prev + 1);
  };

  // Re-fetch when user or trigger changes
  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      if (!user) return; // Don't fetch if no user (should rely on userContext to be ready)

      // Only set loading on first load or extensive changes,
      // maybe we want a "background updating" state?
      // For now, keep it simple.
      if (trigger === 0) setLoading(true); // Initial load

      const data = await fetchCart();

      if (!active) return;

      if (!data || !data.items || data.items.length === 0) {
        setCartItems([]);
        setTotalPrice(0);
        setLoading(false);
        return;
      }

      const rawItems = data.items;
      const productIds = [...new Set(rawItems.map((item) => item.id))];

      // Fetch product details
      const { data: products, error } = await supabase
        .from("Products")
        .select("id, nameEn, nameAr, price, images, is_active")
        .in("id", productIds);

      if (error) {
        console.error("Error fetching product details:", error);
        if (active) setLoading(false);
        return;
      }

      // Merge cart item with product details
      const hydratedItems = rawItems
        .map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id);
          if (!product) return null; // Product might be deleted

          return {
            ...cartItem, // qty, color, size
            product, // name, price, images
          };
        })
        .filter(Boolean); // Remote nulls

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

    if (user && !user.loadingState) {
      loadCart();
    }

    return () => {
      active = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, trigger]); // depend on user and trigger

  return { cartItems, loading, totalPrice, refreshCart };
};
