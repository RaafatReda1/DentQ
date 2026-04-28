import React from "react";
import styles from "../PromoModal.module.css";

const PromoModalForm = ({ form, handleChange, isEditing, t, error, isPending }) => {
  return (
    <>
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

      {/* Type & Discount */}
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
    </>
  );
};

export default PromoModalForm;
