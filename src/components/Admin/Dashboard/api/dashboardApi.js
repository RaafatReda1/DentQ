import { supabase } from "../../../../utils/SupabaseClient";
import { subDays } from "date-fns";

export const fetchDashboardData = async (range) => {
  let fromDate = null;
  let prevFromDate = null;
  let prevToDate = null;
  const now = new Date();

  if (range === "7d") {
    fromDate = subDays(now, 7).toISOString();
    prevToDate = fromDate;
    prevFromDate = subDays(now, 14).toISOString();
  } else if (range === "30d") {
    fromDate = subDays(now, 30).toISOString();
    prevToDate = fromDate;
    prevFromDate = subDays(now, 60).toISOString();
  } else if (range === "90d") {
    fromDate = subDays(now, 90).toISOString();
    prevToDate = fromDate;
    prevFromDate = subDays(now, 180).toISOString();
  }

  // Define queries for current period
  let ordersQuery = supabase.from("Orders").select("*").order("created_at", { ascending: false });
  let itemsQuery = supabase.from("Order_items").select("*");
  let clientsQuery = supabase.from("Clients").select("id, fullName, created_at");
  
  if (fromDate) {
    ordersQuery = ordersQuery.gte("created_at", fromDate);
    clientsQuery = clientsQuery.gte("created_at", fromDate);
    // Note: To perfectly filter items by order date, we fetch all items and filter in JS,
    // or we fetch items that belong to the filtered orders. Given Supabase, fetching all 
    // or doing an inner join is needed. For simplicity, we'll fetch items and filter in memory by order_id.
  }

  // We need prev period orders for deltas
  let prevOrdersQuery = supabase.from("Orders").select("id, total_amount, status, created_at");
  if (prevFromDate && prevToDate) {
    prevOrdersQuery = prevOrdersQuery.gte("created_at", prevFromDate).lt("created_at", prevToDate);
  } else if (range === "all") {
    // No previous period for 'all'
    prevOrdersQuery = supabase.from("Orders").select("id").limit(0);
  }

  const [
    { data: orders, error: ordersErr },
    { data: orderItems, error: itemsErr },
    { data: products, error: productsErr },
    { data: categories, error: categoriesErr },
    { data: carts, error: cartsErr },
    { data: clients, error: clientsErr },
    { data: promoCodes, error: promoErr },
    { data: governorates, error: govErr },
    { data: prevOrders, error: prevOrdersErr }
  ] = await Promise.all([
    ordersQuery,
    itemsQuery,
    supabase.from("Products").select("id, nameEn, nameAr, price, cost, sales_count, category_id, stock"),
    supabase.from("Categories").select("id, name_en, name_ar"),
    supabase.from("Carts").select("*"),
    clientsQuery,
    supabase.from("promo_codes").select("*"),
    supabase.from("GovernoratesShipping").select("*"),
    prevOrdersQuery
  ]);

  if (ordersErr) throw ordersErr;
  if (itemsErr) throw itemsErr;
  if (productsErr) throw productsErr;
  if (categoriesErr) throw categoriesErr;
  if (cartsErr) throw cartsErr;
  if (clientsErr) throw clientsErr;
  if (promoErr) throw promoErr;
  if (govErr) throw govErr;
  if (prevOrdersErr) throw prevOrdersErr;

  return { 
    orders, 
    orderItems, 
    products, 
    categories, 
    carts, 
    clients, 
    promoCodes, 
    governorates,
    prevOrders 
  };
};
