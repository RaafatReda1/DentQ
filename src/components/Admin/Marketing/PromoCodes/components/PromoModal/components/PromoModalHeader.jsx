import React from "react";
import { X } from "lucide-react";
import styles from "../PromoModal.module.css";

const PromoModalHeader = ({ isEditing, t, onClose }) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>
        {isEditing
          ? t("admin.marketing.promo.modal.edit_title", "Edit Promo Code")
          : t("admin.marketing.promo.modal.create_title", "New Promo Code")}
      </h2>
      <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
    </div>
  );
};

export default PromoModalHeader;
