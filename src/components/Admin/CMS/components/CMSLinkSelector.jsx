import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Link as LinkIcon, FolderTree, Package } from "lucide-react";
import { KNOWN_PATHS } from "../config/defaults";
import { useNavCategories, useNavProducts } from "../hooks/cmsHooks";
import styles from "./CMSLinkSelector.module.css";

const CMSLinkSelector = ({ value, onChange, placeholder = "Select a link..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const { data: categories = [] } = useNavCategories();
  const { data: products = [] } = useNavProducts();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Format data
  const staticLinks = KNOWN_PATHS.map(p => ({ id: p.path, label: p.label, type: "static", icon: LinkIcon }));
  const categoryLinks = categories.map(c => ({ id: `/categories/${c.id}`, label: c.name_en || c.name_ar, type: "category", icon: FolderTree }));
  const productLinks = products.map(p => ({ id: `/product/${p.id}`, label: p.nameEn || p.nameAr, type: "product", icon: Package }));

  const allLinks = [...staticLinks, ...categoryLinks, ...productLinks];

  const filtered = allLinks.filter(item => 
    item.label?.toLowerCase().includes(search.toLowerCase()) || 
    item.id?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = allLinks.find(i => i.id === value);
  const selectedLabel = selectedItem ? selectedItem.label : (value || placeholder);
  const SelectedIcon = selectedItem ? selectedItem.icon : LinkIcon;

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        type="button" 
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.triggerLeft}>
          <SelectedIcon size={14} className={styles.triggerIcon} />
          <span className={styles.triggerLabel} title={value}>{selectedLabel}</span>
        </div>
        <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.portal}>
           <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} />
              <input 
                autoFocus 
                placeholder="Search products, categories, or pages..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className={styles.searchInput}
              />
           </div>
           <div className={styles.list}>
              {filtered.length === 0 && <div className={styles.noResult}>No matching links found</div>}
              {filtered.map(item => {
                const ItemIcon = item.icon;
                return (
                  <div 
                    key={item.id} 
                    className={`${styles.item} ${item.id === value ? styles.activeItem : ""}`}
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    <ItemIcon size={13} className={styles.itemIcon} />
                    <div className={styles.itemContent}>
                      <span className={styles.itemLabel}>{item.label}</span>
                      <span className={styles.itemPath}>{item.id}</span>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      )}
    </div>
  );
};

export default CMSLinkSelector;
