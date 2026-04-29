import { supabase } from "../../../../utils/SupabaseClient";

// ─── StoreSettings ──────────────────────────────────────────────────────────
export const getStoreSettings = async () => {
  const { data, error } = await supabase
    .from("StoreSettings")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
};

export const upsertStoreSettings = async (payload) => {
  if (payload.id) {
    const { data, error } = await supabase
      .from("StoreSettings")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", payload.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("StoreSettings")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const uploadLogo = async (file, oldPath) => {
  if (oldPath) {
    await supabase.storage.from("Banners").remove([oldPath]);
  }

  const ext = file.name.split(".").pop();
  const name = `logo_${Date.now()}.${ext}`;
  const path = `LOGO/${name}`;

  const { error: upErr } = await supabase.storage
    .from("Banners")
    .upload(path, file, { upsert: true });
  if (upErr) throw upErr;

  const { data: { publicUrl } } = supabase.storage.from("Banners").getPublicUrl(path);
  return { publicUrl, storagePath: path };
};

// ─── Footer ─────────────────────────────────────────────────────────────────
export const getFooter = async () => {
  const { data, error } = await supabase
    .from("Footer")
    .select("*")
    .eq("slug_name", "main")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
};

export const upsertFooter = async (payload) => {
  if (payload.id) {
    const { data, error } = await supabase
      .from("Footer")
      .update({ ...payload })
      .eq("id", payload.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("Footer")
      .insert([{ slug_name: "main", ...payload }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// ─── About Us ────────────────────────────────────────────────────────────────
export const getAboutUsSections = async () => {
  const { data, error } = await supabase
    .from("AboutUs")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return data || [];
};

export const getAboutStats = async () => {
  const { data, error } = await supabase
    .from("AboutStats")
    .select("*")
    .order("display_order");
  if (error) throw error;
  return data || [];
};

export const upsertAboutUsSections = async (sections) => {
  const { error } = await supabase
    .from("AboutUs")
    .upsert(sections, { onConflict: "section_key" });
  if (error) throw error;
};

export const upsertAboutStats = async (stats) => {
  const { error } = await supabase
    .from("AboutStats")
    .upsert(stats, { onConflict: "stat_key" });
  if (error) throw error;
};

// ─── Legal Pages ─────────────────────────────────────────────────────────────
export const getLegalPages = async () => {
  const { data, error } = await supabase
    .from("LegalPages")
    .select("*");
  if (error) throw error;
  return data || [];
};

export const upsertLegalPage = async (payload) => {
  const { error } = await supabase
    .from("LegalPages")
    .upsert(payload, { onConflict: "page_key" });
  if (error) throw error;
};

// ─── Navigation ──────────────────────────────────────────────────────────────
export const getNavItems = async () => {
  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .order("section_order")
    .order("item_order");
  if (error) throw error;
  return data || [];
};

export const upsertNavItems = async (items) => {
  const { error } = await supabase
    .from("navigation_items")
    .upsert(items, { onConflict: "id" });
  if (error) throw error;
};

export const deleteNavItem = async (id) => {
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) throw error;
};

// ─── Link picker helpers ──────────────────────────────────────────────────────
export const getCategoriesForNav = async () => {
  const { data, error } = await supabase
    .from("Categories")
    .select("id, name_en, name_ar, parent_id")
    .order("name_en");
  if (error) return [];
  return data || [];
};

export const getProductsForNav = async () => {
  const { data, error } = await supabase
    .from("Products")
    .select("id, nameEn, nameAr")
    .order("nameEn");
  if (error) return [];
  return data || [];
};
