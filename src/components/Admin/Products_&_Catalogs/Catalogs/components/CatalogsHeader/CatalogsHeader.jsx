import React from 'react';
import { Plus } from 'lucide-react';
import styles from './CatalogsHeader.module.css';
import { useTranslation } from "react-i18next";

/**
 * Header section for the Catalogs page.
 */
const CatalogsHeader = ({ title, onAddClick }) => {
  const { t } = useTranslation();
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <button className={styles.addBtn} onClick={onAddClick}>
                <Plus size={18} />
                <span>{t("admin.catalog.add_root", "Add Root Category")}</span>
            </button>
        </div>
    );
};

export default CatalogsHeader;
