import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useUserData from "../../../../../Storage/UserDataStorage";
import styles from "./PromoModal.module.css";

// Sub-components
import PromoModalHeader from "./components/PromoModalHeader";
import PromoModalForm from "./components/PromoModalForm";

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
        <PromoModalHeader isEditing={isEditing} t={t} onClose={onClose} />
        <form className={styles.form} onSubmit={handleSubmit}>
          <PromoModalForm 
            form={form} 
            handleChange={handleChange} 
            isEditing={isEditing} 
            t={t} 
            error={error} 
            isPending={isPending} 
          />
        </form>
      </div>
    </div>
  );
};

export default PromoModal;
