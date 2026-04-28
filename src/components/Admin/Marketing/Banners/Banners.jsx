import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useBannersQuery } from "../hooks/useBannersQuery";
import { useBannerMutations } from "../hooks/useBannerMutations";
import BannerCard from "./BannerCard";
import BannerEditor from "./BannerEditor";
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
};

const Banners = () => {
  const { t } = useTranslation();
  const { data: banners = [], isLoading, error, refetch } = useBannersQuery();
  const { createMutation, updateMutation, deleteMutation, activateMutation } = useBannerMutations();

  const [selected, setSelected] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelect = (banner) => {
    setIsCreating(false);
    setSelected(banner);
  };

  const handleNewBanner = () => {
    setIsCreating(true);
    setSelected(null); // Clear selected to show empty form
  };

  const handleToggleActive = (banner) => {
    if (banner.is_active) {
      updateMutation.mutate({ id: banner.id, updates: { is_active: false } });
    } else {
      activateMutation.mutate(banner.id);
    }
  };

  const handleSave = (updates) => {
    if (isCreating) {
      createMutation.mutate(updates, {
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
            banners.map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                isSelected={selected?.id === banner.id}
                onSelect={() => handleSelect(banner)}
                onToggleActive={() => handleToggleActive(banner)}
              />
            ))
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
