import { useMemo, useState, useEffect, useContext } from "react";
import { useCart } from "../../components/Storage/CartProvider";
import { userContext } from "../AppContexts";
import { supabase } from "../SupabaseClient";

/**
 * useBadgeNumberCounter Hook
 * Synchronously calculates the total quantity of items in the cart.
 * Fetches the total number of orders for the current user.
 * Responds immediately to changes in the cart state from the CartProvider.
 */
export const useBadgeNumberCounter = () => {
  const { cart } = useCart();
  const [user] = useContext(userContext);
  const [ordersCount, setOrdersCount] = useState(0);

  const cartCount = useMemo(() => {
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return 0;
    }
    // Calculate total quantity by summing the qty of each item
    return cart.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  }, [cart]);

  useEffect(() => {
    const fetchOrdersCount = async () => {
      let query = supabase.from("Orders").select("*", { count: "exact", head: true });

      if (user?.id) {
        query = query.eq("client_id", user.id);
      } else if (user?.guest_id) {
        query = query.eq("guest_id", user.guest_id);
      } else {
        setOrdersCount(0);
        return;
      }

      const { count, error } = await query;
      if (!error) {
        setOrdersCount(count || 0);
      }
    };

    fetchOrdersCount();
  }, [user]);

  return { cartCount, ordersCount };
};
