import React from "react";
import { X, Save } from "lucide-react";
import styles from "../ShippingEditor.module.css";
import { useShippingForm } from "../hooks/useShippingForm";

const ShippingModal = ({ isOpen, onClose, onSave, editingRate, t }) => {
  const { formData, setField } = useShippingForm(editingRate);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {editingRate ? t("admin.marketing.shipping.edit_title", "Edit Shipping Rate") : t("admin.marketing.shipping.add_title", "Add Shipping Rate")}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>{t("admin.marketing.shipping.gov_en", "Governorate (English)")}</label>
            <input 
              className={styles.input}
              value={formData.governorateEn}
              onChange={(e) => setField("governorateEn", e.target.value)}
              placeholder="e.g. Cairo"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t("admin.marketing.shipping.gov_ar", "Governorate (Arabic)")}</label>
            <input 
              className={styles.input}
              value={formData.governorateAr}
              onChange={(e) => setField("governorateAr", e.target.value)}
              placeholder="مثلاً: القاهرة"
              required
              dir="rtl"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t("admin.marketing.shipping.price_label", "Shipping Price (EGP)")}</label>
            <input 
              type="number"
              className={styles.input}
              value={formData.shippingPrice}
              onChange={(e) => setField("shippingPrice", parseFloat(e.target.value))}
              placeholder="0"
              required
              min="0"
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>{t("common.cancel", "Cancel")}</button>
            <button type="submit" className={styles.saveBtn}>
              <Save size={16} /> {editingRate ? t("common.save", "Save Changes") : t("common.add", "Add Rate")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingModal;
