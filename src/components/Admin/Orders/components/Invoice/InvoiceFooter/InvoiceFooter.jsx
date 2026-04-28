import React from "react";
import styles from "./InvoiceFooter.module.css";
import { Mail, LocationEdit, PhoneIncoming } from "lucide-react";
import { useStoreSettings } from "../../../hooks/useStoreSettings";
import { useTranslation } from "react-i18next";

const InvoiceFooter = () => {
  const { data: storeSettings } = useStoreSettings();
  const { i18n } = useTranslation();

  const isAr = i18n.language === "ar";
  const address = isAr 
    ? (storeSettings?.address_ar || storeSettings?.address_en || "---")
    : (storeSettings?.address_en || storeSettings?.address_ar || "---");

  return (
    <footer className={styles.invoiceFooter}>
      <div className={styles.dataContainer}>
        <div className={styles.data}>
          <section className={styles.dataSection}>
            <PhoneIncoming size={20} />
            <h2>{storeSettings?.phone || "---"}</h2>
          </section>

          <section className={styles.dataSection}>
            <LocationEdit size={20} />
            <h2>{address}</h2>
          </section>

          <section className={styles.dataSection}>
            <Mail size={20} />
            <h2>{storeSettings?.email || "---"}</h2>
          </section>
        </div>

      </div>
      <span className={styles.outerBorder}></span>
    </footer>
  );
};

export default InvoiceFooter;
