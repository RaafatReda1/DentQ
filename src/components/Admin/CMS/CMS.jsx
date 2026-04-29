import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Store, Layout, Info, FileText } from "lucide-react";
import StoreIdentity from "./sections/StoreIdentity";
import FooterEditor from "./sections/FooterEditor";
import AboutUsEditor from "./sections/AboutUsEditor";
import LegalEditor from "./sections/LegalEditor";
import NavigationEditor from "./sections/NavigationEditor";
import styles from "./CMS.module.css";

const CMS = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("store");

  const TABS = [
    { id: "store",  icon: Store,      label: t("admin.cms.tabs.store_identity", "Store identity") },
    { id: "footer", icon: Layout,     label: t("admin.cms.tabs.footer_navigation", "Footer & Navigation") },
    { id: "about",  icon: Info,       label: t("admin.cms.tabs.about_us", "About us") },
    { id: "legal",  icon: FileText,   label: t("admin.cms.tabs.legal_pages", "Legal pages") },
  ];

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t("admin.cms.main.title", "CMS Settings")}</h1>
          <p className={styles.pageSubtitle}>{t("admin.cms.main.subtitle", "Manage storefront content — identity, footer, pages & navigation")}</p>
        </div>
      </div>

      {/* Pill Tab Bar — same pattern as Marketing */}
      <div className={styles.tabBar}>
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`${styles.tab} ${activeTab === id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === "store"  && <StoreIdentity />}
        {activeTab === "footer" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <FooterEditor />
            <NavigationEditor />
          </div>
        )}
        {activeTab === "about"  && <AboutUsEditor />}
        {activeTab === "legal"  && <LegalEditor />}
      </div>
    </div>
  );
};

export default CMS;
