import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import useUserData from "../../../Storage/UserDataStorage";
import styles from "./PromoModal.module.css";

const EMPTY = {
  code: "",
  type: "percentage",
  discount: "",
  max_uses: "",
  expiry: "",
  is_active: true,
};

const PromoModal = ({ editData, onClose, onCreate, onUpdate, isCreating, isUpdating }) => {
  const { t } = useTranslation();
  const { user } = useUserData();
  const isEditing = !!editData;

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editData) {
      setForm({
        code: editData.code || "",
        type: editData.type || "percentage",
        discount: editData.discount ?? "",
        max_uses: editData.max_uses ?? "",
        expiry: editData.expiry ? editData.expiry.split("T")[0] : "",
        is_active: editData.is_active ?? true,
      });
    } else {
      setForm(EMPTY);
    }
    setError("");
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.code.trim()) return setError(t("admin.marketing.promo.modal.err_code", "Code is required"));
    if (!form.discount || isNaN(Number(form.discount))) return setError(t("admin.marketing.promo.modal.err_discount", "Valid discount is required"));

    const payload = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      discount: Number(form.discount),
      max_uses: form.max_uses ? Number(form.max_uses) : 0,
      expiry: form.expiry ? new Date(form.expiry).toISOString() : null,
      is_active: form.is_active,
    };

    if (isEditing) {
      onUpdate(editData.id, payload);
      onClose();
    } else {
      onCreate({
        userEmail: user.email,
        userToken: user.session?.access_token,
        payload,
      });
      onClose();
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditing
              ? t("admin.marketing.promo.modal.edit_title", "Edit Promo Code")
              : t("admin.marketing.promo.modal.create_title", "New Promo Code")}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Code */}
          <div className={styles.field}>
            <label>{t("admin.marketing.promo.modal.code", "Code")} *</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. SUMMER20"
              className={styles.input}
              style={{ fontFamily: "monospace", textTransform: "uppercase" }}
              disabled={isEditing}
            />
          </div>

          {/* Type */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t("admin.marketing.promo.modal.type", "Type")} *</label>
              <select name="type" value={form.type} onChange={handleChange} className={styles.input}>
                <option value="percentage">{t("admin.marketing.promo.modal.percentage", "Percentage (%)")}</option>
                <option value="fixed">{t("admin.marketing.promo.modal.fixed", "Fixed (EGP)")}</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>{t("admin.marketing.promo.modal.discount", "Discount Value")} *</label>
              <input
                name="discount"
                type="number"
                min={0}
                value={form.discount}
                onChange={handleChange}
                placeholder={form.type === "percentage" ? "20" : "100"}
                className={styles.input}
              />
            </div>
          </div>

          {/* Max uses + Expiry */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>{t("admin.marketing.promo.modal.max_uses", "Max Uses")} <span className={styles.hint}>(0 = unlimited)</span></label>
              <input
                name="max_uses"
                type="number"
                min={0}
                value={form.max_uses}
                onChange={handleChange}
                placeholder="100"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label>{t("admin.marketing.promo.modal.expiry", "Expiry Date")}</label>
              <input
                name="expiry"
                type="date"
                value={form.expiry}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className={styles.toggleRow}>
            <label className={styles.togLabel}>{t("admin.marketing.promo.modal.active", "Active on creation")}</label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending
              ? t("admin.marketing.promo.modal.saving", "Saving...")
              : isEditing
                ? t("admin.marketing.promo.modal.save", "Save Changes")
                : t("admin.marketing.promo.modal.create", "Create Code")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromoModal;
