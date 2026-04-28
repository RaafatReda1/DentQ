import React from "react";
import styles from "./InvoiceFooter.module.css";
import { Link2Icon, LocationEdit, PhoneIncoming } from "lucide-react";

const InvoiceFooter = () => {
  return (
    <footer className={styles.invoiceFooter}>
      <div className={styles.dataContainer}>
        <div className={styles.data}>
          <section className={styles.dataSection}>
            <PhoneIncoming size={20} />
            <h2>01022779236</h2>
          </section>

          <section className={styles.dataSection}>
            <LocationEdit size={20} />
            <h2>البحيرة حوش عيسي</h2>
          </section>

          <section className={styles.dataSection}>
            <Link2Icon size={20} />
            <h2>google.com</h2>
          </section>
        </div>
      </div>
      <span className={styles.outerBorder}></span>
    </footer>
  );
};

export default InvoiceFooter;
