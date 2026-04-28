import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import styles from "../BannerEditor.module.css";

const LinkSelector = ({ type, categories, products, value, onChange, lang, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const data = type === "category" 
    ? categories.map(c => ({ id: c.id, label: (c.level > 0 ? "— ".repeat(c.level) : "") + (lang === 'en' ? c.name_en : c.name_ar) })) 
    : products.map(p => ({ id: p.id, label: lang === 'en' ? p.nameEn : p.nameAr }));

  const filtered = data.filter(item => item.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = data.find(i => i.id === value)?.label || t("admin.marketing.banners.editor.choose", "Choose...");

  return (
    <div className={styles.stylishDropdown} ref={dropdownRef}>
      <button type="button" className={styles.dropdownTrigger} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedLabel}</span>
        <ChevronDown size={14} className={isOpen ? styles.rotated : ""} />
      </button>

      {isOpen && (
        <div className={styles.dropdownPortal}>
           <div className={styles.searchBox}>
              <Search size={14} />
              <input 
                autoFocus 
                placeholder={t("admin.products.search_placeholder", "Search...")} 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
           </div>
           <div className={styles.dropdownList}>
              {filtered.length === 0 && <div className={styles.noResult}>{t("admin.search.no_results", "No results found")}</div>}
              {filtered.map(item => (
                <div 
                  key={item.id} 
                  className={`${styles.dropdownItem} ${item.id === value ? styles.activeItem : ""}`}
                  onClick={() => {
                    onChange(item.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {item.label}
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default LinkSelector;
