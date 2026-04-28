import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import { useNavItems, useUpsertNavItems, useDeleteNavItem } from "../hooks/cmsHooks";
import styles from "./NavigationEditor.module.css";
import { GripVertical, Plus, X } from "lucide-react";

const NavigationEditor = () => {
  const { data: remote } = useNavItems();
  const { mutate: save, isPending: saving } = useUpsertNavItems();
  const { mutate: deleteItem } = useDeleteNavItem();
  const [items, setItems] = useState(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => { if (remote) setItems(remote); }, [remote]);

  if (!items) return <div className={styles.loading}>Loading navigation items…</div>;

  const isDirty = JSON.stringify(items) !== JSON.stringify(remote);

  // Group items by section_key
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

  // Simple drag-and-drop within sections
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

  return (
    <SectionCard
      id="navigation-editor"
      title="Navigation items"
      subtitle="Manage storefront menu links — drag to reorder"
      saveLabel="Save nav"
      onSave={handleSave}
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
                  <GripVertical size={16} className={styles.dragHandle} />
                  <span className={styles.linkPath}>{item.item_link}</span>
                  <input
                    className={styles.labelInput}
                    value={item.item_label_en}
                    onChange={(e) => updateItem(item.id, "item_label_en", e.target.value)}
                    placeholder="EN"
                    dir="ltr"
                  />
                  <input
                    className={`${styles.labelInput} ${styles.rtl}`}
                    value={item.item_label_ar}
                    onChange={(e) => updateItem(item.id, "item_label_ar", e.target.value)}
                    placeholder="AR"
                    dir="rtl"
                  />
                  <button className={styles.removeBtn} onClick={() => removeItem(item)} title="Remove">
                    <X size={13} />
                  </button>
                </div>
              ))}
          </div>

          <button className={styles.addItemBtn} onClick={() => addItem(sectionKey)}>
            <Plus size={13} /> Add nav item
          </button>
        </div>
      ))}
    </SectionCard>
  );
};

export default NavigationEditor;
