import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import styles from "../CategoryPage.module.css";

/**
 * Renders the breadcrumb navigation trail for a given category.
 * Calculates the path dynamically traversing up via `parent_id`.
 */
const CategoryBreadcrumbs = ({ currentCategory, CategoriesList, isLTR }) => {
  const breadcrumbs = useMemo(() => {
    if (!currentCategory || !CategoriesList) return [];

    const lineage = [];
    let current = currentCategory;

    // Trace ancestors all the way up to root
    while (current) {
      lineage.unshift(current);
      current = CategoriesList.find((c) => c.id === current.parent_id);
    }
    return lineage;
  }, [currentCategory, CategoriesList]);

  const ArrowIcon = isLTR ? ChevronRight : ChevronLeft;

  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/" className={styles.crumbLink}>
        {isLTR ? "Home" : "الصفحة الرئيسية"}
      </Link>
      <ArrowIcon size={14} className={styles.crumbArrow} />
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const name = isLTR ? crumb.name_en : crumb.name_ar;

        return (
          <React.Fragment key={crumb.id}>
            {isLast ? (
              <span className={styles.crumbActive}>{name}</span>
            ) : (
              <>
                <Link
                  to={`/category/${crumb.slug}`}
                  className={styles.crumbLink}
                >
                  {name}
                </Link>
                <ArrowIcon size={14} className={styles.crumbArrow} />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default CategoryBreadcrumbs;
