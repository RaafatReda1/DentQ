import { supabase } from "./SupabaseClient";

const FetchProducts = async (products, setProducts) => {
  try {
    const {data: productsData, error: productsError } = await supabase.from("Products").select("*");
    const {data: categoriesData, error: categoriesError } = await supabase.from("Categories").select("*");
    if (productsError || categoriesError) {
      console.log("Error fetching products:", productsError);
    } else if (productsData && categoriesData) {
      console.log("Prdouct's Fetched:", productsData);
      setProducts({
        productsList: productsData,
        CategoriesList: categoriesData,
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
