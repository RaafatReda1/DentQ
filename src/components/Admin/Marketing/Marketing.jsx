import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tag, Image, BarChart2 } from "lucide-react";
import PromoCodes from "./PromoCodes/PromoCodes";
import Banners from "./Banners/Banners";
import Pixels from "./Pixels/Pixels";
import styles from "./Marketing.module.css";

const TABS = [
  { id: "promo", icon: Tag, labelKey: "admin.marketing.tabs.promo" },
  { id: "banners", icon: Image, labelKey: "admin.marketing.tabs.banners" },
  { id: "pixels", icon: BarChart2, labelKey: "admin.marketing.tabs.pixels" },
];

const Marketing = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("promo");

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t("admin.marketing.title", "Marketing")}</h1>
          <p className={styles.pageSubtitle}>
            {t("admin.marketing.subtitle", "Manage promo codes, banners, and growth tools for DentQ")}
          </p>
        </div>
      </div>

      {/* Pill Tab Bar */}
      <div className={styles.tabBar}>
        {TABS.map(({ id, icon: Icon, labelKey }) => (
          <button
            key={id}
            className={`${styles.tab} ${activeTab === id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={15} />
            {t(labelKey, id)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === "promo" && <PromoCodes />}
        {activeTab === "banners" && <Banners />}
        {activeTab === "pixels" && <Pixels />}
      </div>
    </div>
  );
};

export default Marketing;
