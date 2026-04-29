import React from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./SidebarHeader.module.css";

const SidebarHeader = ({ search, setSearch, filter, setFilter, sortBy, setSortBy, markers }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.sidebarHeader}>
        <div className={styles.searchWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            className={styles.searchInput}
            placeholder={t("admin.cms.messages.search_ph", "Search by name, email or message...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterTabs}>
          <button className={`${styles.filterBtn} ${filter === "all" ? styles.activeFilter : ""}`} onClick={() => setFilter("all")}>
            {t("admin.cms.messages.all", "All")}
          </button>
          <button className={`${styles.filterBtn} ${filter === "unread" ? styles.activeFilter : ""}`} onClick={() => setFilter("unread")}>
            {t("admin.cms.messages.unread", "Unread")}
          </button>
          {markers.map(m => (
            <button 
              key={m.id} 
              className={`${styles.filterBtn} ${filter === m.id ? styles.activeFilter : ""}`} 
              onClick={() => setFilter(m.id)}
            >
              {t(`admin.cms.messages.${m.labelKey}`, m.id)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.sortWrapper}>
        <ArrowUpDown size={12} className={styles.sortLabelIcon} />
        <span className={styles.sortLabel}>SORT BY:</span>
        <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Sender Name</option>
          <option value="marker">Marker Category</option>
          <option value="unread">Unread First</option>
        </select>
      </div>
    </>
  );
};

export default SidebarHeader;
