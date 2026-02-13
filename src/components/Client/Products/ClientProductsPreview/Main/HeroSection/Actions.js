import { supabase } from "../../../../../../utils/SupabaseClient";
const fetchBanners = async (slugName) => {
  let query = supabase.from("Banners").select("*");

  if (slugName) {
    query = query.eq("slug", slugName);
  }

  const { data, error } = await query;

  if (error) {
    console.log("Error fetching banners:", error);
    return null;
  }

  console.log("Banners Fetched:", data);
  return data;
};


export default fetchBanners