import React from "react";
import { Link } from "react-router-dom";
import styles from "../CategoriesPreview.module.css";
import MegaMenuContent from "./MegaMenuContent";

/**
 * RootCategoryItem represents a top-level category item in the navigation bar.
 * It handles its own hover events and dynamically renders the MegaMenuContent 
 * if it has children and is currently active.
 */
const RootCategoryItem = ({
  root,
  children,
  activeMenu,
  getChildren,
  isLTR,
  handleMouseEnter,
  handleMouseLeave,
}) => {
  const hasChildren = children.length > 0;

  return (
    <li
      className={styles.rootItem}
      onMouseEnter={() => handleMouseEnter(root.id)}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/category/${root.slug}`} className={styles.rootLink}>
        {/* Render Vector Icon if available */}
        {root.icon && (
          <span
            className={styles.icon}
            dangerouslySetInnerHTML={{ __html: root.icon }}
          ></span>
        )}
        
        {/* Render Image URL if no SVGs exist */}
        {!root.icon && root.image_url && (
          <img src={root.image_url} alt="" className={styles.catImage} />
        )}
        
        <span className={styles.catName}>
          {isLTR ? root.name_en : root.name_ar}
        </span>
        
        {/* Render drop-down arrow hint */}
        {hasChildren && <span className={styles.arrow}>&#x25BE;</span>}
      </Link>

      {/* Conditionally Render Mega Menu Dropdown */}
      {hasChildren && activeMenu === root.id && (
        <MegaMenuContent
          children={children}
          getChildren={getChildren}
          isLTR={isLTR}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          rootId={root.id}
        />
      )}
    </li>
  );
};

export default RootCategoryItem;
