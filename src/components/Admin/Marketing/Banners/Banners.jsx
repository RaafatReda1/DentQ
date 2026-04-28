import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useBannersQuery } from "../hooks/useBannersQuery";
import { useBannerMutations } from "../hooks/useBannerMutations";
import BannerCard from "./components/BannerCard/BannerCard";
import BannerEditor from "./components/BannerEditor/BannerEditor";
import styles from "./Banners.module.css";

const DEFAULT_BANNER = {
  title_en: "",
  title_ar: "",
  subtitle_en: "",
  subtitle_ar: "",
  cta_text_en: "",
  cta_text_ar: "",
  cta_link: "",
  is_active: false,
  slug: "",
  title_color: "#ffffff",
  subtitle_color: "#e2e8f0",
  cta_bg_color: "#ffffff",
  cta_txt_color: "#1e293b",
  bg_linear_colors: ["#185FA5", "#378ADD"],
  related_cat_id: null,
  order: 0,
};

const Banners = () => {
  const { t } = useTranslation();
  const { data: banners = [], isLoading, error, refetch } = useBannersQuery();
  const { createMutation, updateMutation, reorderMutation, deleteMutation } = useBannerMutations();

  const [selected, setSelected] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelect = (banner) => {
    setIsCreating(false);
    setSelected(banner);
  };

  const handleNewBanner = () => {
    setIsCreating(true);
    setSelected(null);
  };

  const handleToggleActive = (banner) => {
    updateMutation.mutate({ id: banner.id, updates: { is_active: !banner.is_active } });
  };

  const handleSave = (updates) => {
    if (isCreating) {
      // Set order to end of list
      const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order || 0)) : -1;
      createMutation.mutate({ ...updates, order: maxOrder + 1 }, {
        onSuccess: (newBanner) => {
          setIsCreating(false);
          setSelected(newBanner);
        },
      });
    } else if (selected) {
      updateMutation.mutate({ id: selected.id, updates });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t("admin.marketing.banners.confirm_delete", "Are you sure?"))) {
       deleteMutation.mutate(id);
       if (selected?.id === id) setSelected(null);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Prepare updates for the API
    const orderMap = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    reorderMutation.mutate(orderMap);
  };

  const editorData = isCreating ? DEFAULT_BANNER : selected;

  return (
    <div className={styles.container}>
      {/* Left Panel — Banner List */}
      <div className={styles.leftPanel}>
        <div className={styles.leftHeader}>
          <div className={styles.leftTitleRow}>
            <h3 className={styles.leftTitle}>{t("admin.marketing.banners.title", "Banners")}</h3>
            <div className={styles.headerActions}>
               {error && <button className={styles.retryBtn} onClick={() => refetch()} title="Retry"><Plus size={14} style={{transform: 'rotate(45deg)'}}/></button>}
               <button className={styles.newBannerBtnSmall} onClick={handleNewBanner} title={t("admin.marketing.banners.new_banner")}>
                 <Plus size={16} />
               </button>
            </div>
          </div>
        </div>

        <div className={styles.bannerList}>
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeletonCard} style={{ animationDelay: `${i * 0.1}s` }} />
            ))
          ) : error ? (
             <div className={styles.errorMsg}>{t("admin.marketing.banners.err_load", "Error loading banners")}</div>
          ) : banners.length === 0 ? (
             <div className={styles.emptyList}>{t("admin.marketing.banners.empty", "No banners")}</div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="banners">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {banners.map((banner, index) => (
                      <Draggable key={banner.id} draggableId={banner.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${styles.draggableItem} ${snapshot.isDragging ? styles.dragging : ""}`}
                          >
                            <div {...provided.dragHandleProps} className={styles.dragHandle}>
                              <GripVertical size={16} />
                            </div>
                            <div className={styles.cardWrapper}>
                              <BannerCard
                                banner={banner}
                                isSelected={selected?.id === banner.id}
                                onSelect={() => handleSelect(banner)}
                                onToggleActive={() => handleToggleActive(banner)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Right Panel — Editor */}
      <div className={styles.rightPanel}>
        {editorData ? (
          <BannerEditor
            key={isCreating ? "new" : selected?.id}
            banner={editorData}
            isCreating={isCreating}
            isSaving={createMutation.isPending || updateMutation.isPending}
            onSave={handleSave}
            onDelete={() => handleDelete(selected?.id)}
          />
        ) : (
          <div className={styles.emptyEditor}>
            <p>{t("admin.marketing.banners.select_hint", "Select a banner or create a new one")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;
