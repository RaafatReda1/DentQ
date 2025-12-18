import { supabase } from "./SupabaseClient";

const FetchProducts = async (products, setProducts) => {
  try {
    const { data, error } = await supabase.from("Products").select("*");
    if (error) {
      console.log("Error fetching products:", error);
    } else if (data) {
      console.log("Prdouct's Fetched:", data);
      setProducts({
        productsList: data,
        productsLoadingState: false,
      });
    }
  } catch {
    console.log("Unexpected Err happend Fetching Products");
  } finally {
    setProducts((prev) => ({
      ...prev,
      productsLoadingState: false,
    }));
  }
};

export default FetchProducts;
