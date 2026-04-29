import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import CMSLinkSelector from "../components/CMSLinkSelector";
import { useNavItems, useUpsertNavItems, useDeleteNavItem } from "../hooks/cmsHooks";
import styles from "./NavigationEditor.module.css";
import { GripVertical, Plus, X } from "lucide-react";
import { Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

const NavigationEditor = () => {
  const { t } = useTranslation();
  const { data: remote, isLoading } = useNavItems();
  const { mutate: save, isPending: saving } = useUpsertNavItems();
  const { mutate: deleteItem } = useDeleteNavItem();
  const [items, setItems] = useState(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => { if (!isLoading) setItems(remote || []); }, [remote, isLoading]);

  if (isLoading || !items) {
    return (
      <div className={styles.skeletonWrap} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <Skeleton variant="rectangular" width="100%" height={60} style={{ borderRadius: 8 }} />
        <Skeleton variant="rectangular" width="100%" height={40} style={{ borderRadius: 8 }} />
        <Skeleton variant="rectangular" width="100%" height={40} style={{ borderRadius: 8 }} />
        <Skeleton variant="rectangular" width="100%" height={40} style={{ borderRadius: 8 }} />
      </div>
    );
  }

  const isDirty = JSON.stringify(items) !== JSON.stringify(remote);

  const groups = items.reduce((acc, item) => {
    if (!acc[item.section_key]) acc[item.section_key] = [];
    acc[item.section_key].push(item);
    return acc;
  }, {});

  const updateItem = (id, field, val) =>
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, [field]: val } : it));

  const addItem = (section_key) => {
    const sectionItems = items.filter((it) => it.section_key === section_key);
    const sectionOrder = sectionItems[0]?.section_order ?? 0;
    const newItem = {
      id: `new-${Date.now()}`,
      section_key,
      section_title_en: sectionItems[0]?.section_title_en ?? "",
      section_title_ar: sectionItems[0]?.section_title_ar ?? "",
      item_label_en: "",
      item_label_ar: "",
      item_link: "/",
      item_order: sectionItems.length,
      section_order: sectionOrder,
      isNew: true,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (item) => {
    if (item.isNew) {
      setItems((prev) => prev.filter((it) => it.id !== item.id));
    } else {
      deleteItem(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
    }
  };

  const onDragStart = (e, id) => { setDragging(id); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e, targetId) => {
    e.preventDefault();
    if (dragging === targetId) return;
    setItems((prev) => {
      const from = prev.findIndex((it) => it.id === dragging);
      const to = prev.findIndex((it) => it.id === targetId);
      if (from < 0 || to < 0) return prev;
      if (prev[from].section_key !== prev[to].section_key) return prev;
      const next = [...prev];
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next.map((it, idx) =>
        it.section_key === prev[to].section_key ? { ...it, item_order: idx } : it
      );
    });
  };

  const handleSave = () => {
    const payload = items
      .filter((it) => !it.isNew || (it.item_label_en && it.item_link))
      .map(({ isNew, ...it }) => it);
    save(payload);
  };

  const handleDiscard = () => setItems(remote);
  
  const handleResetToDefault = () => {
    if (window.confirm(t("admin.cms.navigation.reset_confirm", "Are you sure you want to delete all navigation links? This will reset the footer columns."))) {
      setItems([]);
    }
  };

  return (
    <SectionCard
      id="navigation-editor"
      title={t("admin.cms.navigation.title", "Column Links Navigation")}
      subtitle={t("admin.cms.navigation.subtitle", "Manage the links that appear in the footer columns. Drag to reorder. Use the link selector to connect to internal routes, categories, or products.")}
      saveLabel={t("admin.cms.navigation.save", "Save navigation")}
      onSave={handleSave}
      onDiscard={handleDiscard}
      onResetToDefault={handleResetToDefault}
      saving={saving}
      isDirty={isDirty}
    >
      {Object.entries(groups).map(([sectionKey, sectionItems]) => (
        <div key={sectionKey} className={styles.group}>
          <div className={styles.groupHeader}>
            <span className={styles.groupLabel}>{sectionItems[0]?.section_title_en?.toUpperCase() || sectionKey.toUpperCase()}</span>
          </div>

          <div className={styles.itemsList}>
            {sectionItems
              .sort((a, b) => a.item_order - b.item_order)
              .map((item) => (
                <div
                  key={item.id}
                  className={`${styles.itemRow} ${dragging === item.id ? styles.dragging : ""}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.id)}
                  onDragOver={(e) => onDragOver(e, item.id)}
                  onDragEnd={() => setDragging(null)}
                >
                  <div className={styles.dragHandleWrapper}>
                    <GripVertical size={16} className={styles.dragHandle} />
                  </div>
                  
                  <div className={styles.itemControls}>
                    <div className={styles.labelInputs}>
                      <input
                        className={styles.labelInput}
                        value={item.item_label_en}
                        onChange={(e) => updateItem(item.id, "item_label_en", e.target.value)}
                        placeholder={t("admin.cms.navigation.link_label_en", "Link Label (EN)")}
                        dir="ltr"
                      />
                      <input
                        className={`${styles.labelInput} ${styles.rtl}`}
                        value={item.item_label_ar}
                        onChange={(e) => updateItem(item.id, "item_label_ar", e.target.value)}
                        placeholder={t("admin.cms.navigation.link_label_ar", "Link Label (AR)")}
                        dir="rtl"
                      />
                    </div>
                    <div className={styles.selectorWrapper}>
                      <CMSLinkSelector 
                        value={item.item_link} 
                        onChange={(newLink) => updateItem(item.id, "item_link", newLink)} 
                        placeholder={t("admin.cms.navigation.link_url", "URL / Path")}
                      />
                    </div>
                  </div>

                  <button className={styles.removeBtn} onClick={() => removeItem(item)} title="Remove link">
                    <X size={15} />
                  </button>
                </div>
              ))}
          </div>

          <button className={styles.addItemBtn} onClick={() => addItem(sectionKey)}>
            <Plus size={14} /> {t("admin.cms.navigation.add_link", "Add Link")} {t("admin.cms.common.to", "to")} {sectionItems[0]?.section_title_en || sectionKey}
          </button>
        </div>
      ))}
    </SectionCard>
  );
};

export default NavigationEditor;
