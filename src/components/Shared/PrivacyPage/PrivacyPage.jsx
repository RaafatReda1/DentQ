import React from "react";
import styles from "./PrivacyPage.module.css";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const isLTR = i18n.language.startsWith("en");
  const contentArray = t("privacy_page.content", { returnObjects: true });
  const contentToRender = Array.isArray(contentArray) ? contentArray : [];

  return (
    <div className={styles.pageContainer} dir={isLTR ? "ltr" : "rtl"}>
      <div className={styles.content}>
        <img src="/logo.png" alt="DentQ Logo" className={styles.logo} />
        <h1>{t("privacy_page.title", "Privacy Policy")}</h1>
        <div className={styles.textContent}>
          {contentToRender.map((block, idx) => {
            if (block.type === "h2") return <h2 key={idx}>{block.text}</h2>;
            if (block.type === "h3") return <h3 key={idx}>{block.text}</h3>;
            if (block.type === "li") return <li key={idx} className={styles.listItem}>{block.text}</li>;
            return <p key={idx}>{block.text}</p>;
          })}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;