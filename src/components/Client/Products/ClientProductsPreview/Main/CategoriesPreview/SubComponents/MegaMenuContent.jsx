import React from "react";
import { Link } from "react-router-dom";
import styles from "../CategoriesPreview.module.css";

/**
 * MegaMenuContent displays the dropdown block containing sub-categories
 * and their respective grand-children.
 *
 * @param {Array} children - Direct child categories of the currently hovered root.
 * @param {Function} getChildren - Helper function to get children of a given category ID.
 * @param {Boolean} isLTR - Indicates if the current language is Left-to-Right (e.g. English).
 * @param {Function} handleMouseEnter - Re-triggers hover state to keep menu open.
 * @param {Function} handleMouseLeave - Triggers timeout to hide menu after delay.
 * @param {String} rootId - ID of the root category this menu belongs to.
 */
const MegaMenuContent = ({
  children,
  getChildren,
  isLTR,
  handleMouseEnter,
  handleMouseLeave,
  rootId,
}) => {
  return (
    <div
      className={styles.megaMenu}
      onMouseEnter={() => handleMouseEnter(rootId)}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.megaMenuContainer}>
        {children.map((child) => {
          const grandChildren = getChildren(child.id);
          return (
            <div key={child.id} className={styles.subCategoryColumn}>
              {/* Sub Category Link */}
              <Link
                to={`/category/${child.slug}`}
                className={styles.subCategoryTitle}
              >
                {isLTR ? child.name_en : child.name_ar}
              </Link>
              
              {/* Grand Children Links (if any) */}
              {grandChildren.length > 0 && (
                <ul className={styles.grandChildrenList}>
                  {grandChildren.map((gc) => (
                    <li key={gc.id}>
                      <Link
                        to={`/category/${gc.slug}`}
                        className={styles.grandChildLink}
                      >
                        {isLTR ? gc.name_en : gc.name_ar}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MegaMenuContent;
