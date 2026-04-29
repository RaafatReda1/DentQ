import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Store, Layout, Info, FileText, Navigation } from "lucide-react";
import StoreIdentity from "./sections/StoreIdentity";
import FooterEditor from "./sections/FooterEditor";
import AboutUsEditor from "./sections/AboutUsEditor";
import LegalEditor from "./sections/LegalEditor";
import NavigationEditor from "./sections/NavigationEditor";
import styles from "./CMS.module.css";

const TABS = [
  { id: "store",  icon: Store,      label: "Store identity" },
  { id: "footer", icon: Layout,     label: "Footer & Navigation" },
  { id: "about",  icon: Info,       label: "About us" },
  { id: "legal",  icon: FileText,   label: "Legal pages" },
];

const CMS = () => {
  const [activeTab, setActiveTab] = useState("store");

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>CMS Settings</h1>
          <p className={styles.pageSubtitle}>Manage storefront content — identity, footer, pages &amp; navigation</p>
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
