import React, { useState, useEffect } from "react";
import styles from "./StoreSettingsEditor.module.css";
import { X, Save, Palette, Phone, MapPin, Mail } from "lucide-react";
import { useStoreSettings, useUpdateStoreSettings } from "../../hooks/useStoreSettings";

const StoreSettingsEditor = ({ isOpen, onClose }) => {
  const { data: storeSettings } = useStoreSettings();
  const { mutate: updateSettings, isPending } = useUpdateStoreSettings();

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address_en: "",
    address_ar: "",
    accent_color: "#1a1a2e",
  });

  // Sync state with DB data
  useEffect(() => {
    if (storeSettings) {
      setFormData({
        phone: storeSettings.phone || "",
        email: storeSettings.email || "",
        address_en: storeSettings.address_en || "",
        address_ar: storeSettings.address_ar || "",
        accent_color: storeSettings.accent_color || "#1a1a2e",
      });
    }
  }, [storeSettings]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateSettings(
      { id: storeSettings?.id, payload: formData },
      {
        onSuccess: () => {
          onClose(); // Close modal immediately on success
        },
      }
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h2>Brand Settings</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Contact Details */}
          <div className={styles.formGroup}>
            <label>
              <Phone size={16} /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 01022779236"
              dir="ltr"
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@yourstore.com"
              dir="ltr"
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <MapPin size={16} /> Address (Arabic)
            </label>
            <input
              type="text"
              name="address_ar"
              value={formData.address_ar}
              onChange={handleChange}
              placeholder="البحيرة حوش عيسي"
              dir="rtl"
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              <MapPin size={16} /> Address (English)
            </label>
            <input
              type="text"
              name="address_en"
              value={formData.address_en}
              onChange={handleChange}
              placeholder="EG, Beheira"
              dir="ltr"
            />
          </div>

          {/* Styling / Accent Color */}
          <div className={styles.colorSection}>
            <label className={styles.formGroup} style={{ gap: "4px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", color: "#334155" }}>
                <Palette size={16} /> Invoice Accent Color
              </span>
              <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                Customizes headers, accents, and shapes.
              </p>
            </label>
            
            <div className={styles.colorPickerWrap}>
              <input
                type="color"
                name="accent_color"
                value={formData.accent_color}
                onChange={handleChange}
                className={styles.colorInput}
              />
              <span className={styles.colorHex}>
                {formData.accent_color.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button className={`${styles.btn} ${styles.btnSave}`} onClick={handleSave} disabled={isPending}>
            <Save size={16} /> {isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsEditor;
