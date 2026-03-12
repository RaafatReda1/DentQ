import React, { useState, useRef } from "react";
import styles from "./CategoriesPreview.module.css";
import { useTranslation } from "react-i18next";
import RootCategoryItem from "./SubComponents/RootCategoryItem";

const CategoriesPreview = ({ categories = [] }) => {
  const { i18n } = useTranslation();
  const isLTR = i18n.language === "en";
  
  // States to handle drop-down menu visibility and hover delays
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

  // Short circuit if there is no data to render.
  if (!categories || categories.length === 0) return null;

  // Filter and sort the top-level (root) categories
  const rootCategories = categories
    .filter((c) => !c.parent_id && c.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // Helper method to retrieve child categories recursively
  const getChildren = (parentId) => {
    return categories
      .filter((c) => c.parent_id === parentId && c.is_active !== false)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  // Immediate hover triggers the mega menu to open while cancelling hide timeouts
  const handleMouseEnter = (id) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(id);
  };

  // Leaving the hover area triggers a slightly delayed hide action for smoother UX
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  return (
    <nav className={styles.categoriesNav} dir={isLTR ? "ltr" : "rtl"}>
      <ul className={styles.rootList}>
        {rootCategories.map((root) => {
          const children = getChildren(root.id);
          
          return (
            <RootCategoryItem
              key={root.id}
              root={root}
              children={children}
              activeMenu={activeMenu}
              getChildren={getChildren}
              isLTR={isLTR}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoriesPreview;