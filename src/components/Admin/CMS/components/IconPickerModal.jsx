import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ICON_REGISTRY } from "../../../../utils/IconRegistry";
import styles from "./IconPickerModal.module.css";

const IconPickerModal = ({ isOpen, onClose, onSelect, selectedKey }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = ICON_REGISTRY.filter((icon) =>
    icon.label.toLowerCase().includes(search.toLowerCase()) ||
    icon.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{t("admin.cms.icon_picker.title", "Choose an Icon")}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            autoFocus
            type="text"
            className={styles.searchInput}
            placeholder={t("admin.cms.icon_picker.search_placeholder", "Search icons (e.g., TikTok, Snapchat)...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.grid}>
          {filtered.length === 0 ? (
            <div className={styles.noResults}>{t("admin.cms.icon_picker.no_results", "No icons found.")}</div>
          ) : (
            filtered.map((icon) => {
              const IconComp = icon.component;
              const isActive = selectedKey === icon.key;
              return (
                <button
                  key={icon.key}
                  className={`${styles.iconCard} ${isActive ? styles.active : ""}`}
                  onClick={() => {
                    onSelect(icon.key);
                    onClose();
                  }}
                  title={icon.label}
                >
                  <IconComp size={24} className={styles.iconElement} />
                  <span className={styles.iconLabel}>{icon.label}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default IconPickerModal;
