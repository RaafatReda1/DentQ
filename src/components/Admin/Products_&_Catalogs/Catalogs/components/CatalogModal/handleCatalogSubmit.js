import { computeLevel } from "../../../../Products_&_Catalogs/Catalogs/lib/catalogHelpers";

export const handleCatalogSubmit = async ({
  form,
  category,
  allFilteredCats,
  onSave,
  setLoading,
  isEditing,
}) => {
  setLoading(true);
  try {
    const parentId = form.parent_id || null;
    const level = computeLevel(parentId, allFilteredCats);
    let sort_order = category?.sort_order || 1;

    if (!isEditing || category.parent_id !== parentId) {
      const siblings = allFilteredCats.filter((c) => c.parent_id === parentId);
      sort_order =
        siblings.length > 0
          ? Math.max(...siblings.map((s) => s.sort_order || 0)) + 1
          : 1;
    }

    const payload = {
      name_en: form.name_en.trim(),
      name_ar: form.name_ar.trim() || null,
      slug: form.slug.trim(),
      parent_id: parentId,
      level,
      sort_order,
    };

    await onSave(payload, category?.id);
  } finally {
    setLoading(false);
  }
};
