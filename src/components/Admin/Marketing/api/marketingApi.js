import { supabase } from "../../../../utils/SupabaseClient";

// --- Promo Codes ---
export const getPromoCodes = async () => {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const createPromoCode = async ({ userEmail, userToken, payload }) => {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-promo-code`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ email: userEmail, ...payload }),
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to create promo code");
  return json.promoCode;
};

export const updatePromoCode = async (id, updates) => {
  const { data, error } = await supabase
    .from("promo_codes")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePromoCode = async (id) => {
  const { error } = await supabase.from("promo_codes").delete().eq("id", id);
  if (error) throw error;
};

// --- Banners ---
export const getBanners = async () => {
    const { data, error } = await supabase
        .from("Banners")
        .select("*")
        .order("order", { ascending: true })
        .order("created_at", { ascending: false });
    if (error) {
        console.error("Banners fetch error:", error);
        return []; // Suppress error for UI and return empty array
    }
    return data || [];
};

export const createBanner = async (banner) => {
    const { data, error } = await supabase.from("Banners").insert([banner]).select();
    if (error) throw error;
    return data[0];
};

export const updateBanner = async (id, updates) => {
    const { error } = await supabase.from("Banners").update(updates).eq("id", id);
    if (error) throw error;
};

export const updateBannerOrder = async (orderMap) => {
    // orderMap = [{ id: '...', order: 0 }, ...]
    const updates = orderMap.map(item => supabase.from("Banners").update({ order: item.order }).eq("id", item.id));
    const results = await Promise.all(updates);
    const firstError = results.find(r => r.error);
    if (firstError) throw firstError.error;
};

export const deleteBanner = async (id) => {
    const { error } = await supabase.from("Banners").delete().eq("id", id);
    if (error) throw error;
};


// --- Storage ---
export const uploadBannerImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `banner-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('Banners')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('Banners')
    .getPublicUrl(filePath);

  return publicUrl;
};

// --- Categories for links ---
export const getLinkCategories = async () => {
    const { data, error } = await supabase
        .from("Categories")
        .select("id, name_en, name_ar, parent_id")
        .order("name_en");
    if (error) {
        console.error("Categories fetch error:", error);
        return [];
    }
    return data || [];
};

// --- Products for links ---
export const getLinkProducts = async () => {
    const { data, error } = await supabase
        .from("Products")
        .select("id, nameEn, nameAr")
        .order("nameEn");
    if (error) {
        console.error("Products fetch error:", error);
        return [];
    }
    return data || [];
};
// --- Shipping Rates ---
export const getShippingRates = async () => {
  const { data, error } = await supabase
    .from("GovernoratesShipping")
    .select("*")
    .order("governorateEn", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createShippingRate = async (rate) => {
  const { data, error } = await supabase
    .from("GovernoratesShipping")
    .insert([rate])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateShippingRate = async (id, updates) => {
  const { data, error } = await supabase
    .from("GovernoratesShipping")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteShippingRate = async (id) => {
  const { error } = await supabase
    .from("GovernoratesShipping")
    .delete()
    .eq("id", id);
  if (error) throw error;
};
