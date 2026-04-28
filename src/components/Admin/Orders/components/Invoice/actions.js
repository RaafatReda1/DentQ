import { supabase } from "../../../../../utils/SupabaseClient";

export const getStoreSettings = async () => {
  const { data, error } = await supabase
    .from("StoreSettings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data || null;
};

export const updateStoreSettings = async (id, payload) => {
  if (!id) {
    // Insert if no row exists
    const { data, error } = await supabase
      .from("StoreSettings")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // Update existing row
    const { data, error } = await supabase
      .from("StoreSettings")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
