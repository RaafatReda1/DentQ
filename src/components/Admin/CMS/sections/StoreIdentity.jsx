import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@mui/material";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import LogoManager from "../components/LogoManager";
import { useStoreIdentity } from "../hooks/useStoreIdentity";
import styles from "./StoreIdentity.module.css";

const StoreIdentity = () => {
  const { t } = useTranslation();
  const { draft, remote, saving, uploading, fileRef, set, handleSave, handleDiscard, handleUpload, handleResetLogo, handleResetToDefault } = useStoreIdentity();

  if (!draft) return <IdentitySkeleton styles={styles} />;
  const isDirty = JSON.stringify(draft) !== JSON.stringify(remote);

  return (
    <SectionCard id="store-identity" title={t("admin.cms.store_identity.title")} subtitle={t("admin.cms.store_identity.subtitle")}
      saveLabel={t("admin.cms.common.save")} onSave={handleSave} onDiscard={handleDiscard} onResetToDefault={handleResetToDefault}
      saving={saving} isDirty={isDirty}>
      <BilingualField label={t("admin.cms.store_identity.address")} valueEn={draft.address_en} valueAr={draft.address_ar}
        onChangeEn={(v) => set("address_en", v)} onChangeAr={(v) => set("address_ar", v)}
        placeholderEn={t("admin.cms.store_identity.address_en_ph")} placeholderAr={t("admin.cms.store_identity.address_ar_ph")} />

      <div className={styles.row}>
        <ContactField id="store-phone" label={t("admin.cms.store_identity.phone")} value={draft.phone} onChange={(v) => set("phone", v)} hint={t("admin.cms.store_identity.phone_hint")} styles={styles} />
        <ContactField id="store-email" label={t("admin.cms.store_identity.email")} value={draft.email} onChange={(v) => set("email", v)} hint={t("admin.cms.store_identity.email_hint")} styles={styles} type="email" />
      </div>
      <hr className={styles.divider} />
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{t("admin.cms.store_identity.accent_color")}</label>
          <div className={styles.colorRow}>
            <div className={styles.swatch} style={{ background: draft.accent_color || "#1e293b" }} onClick={() => document.getElementById("color-picker").click()} />
            <input id="color-picker" type="color" value={draft.accent_color || "#1e293b"} onChange={(e) => set("accent_color", e.target.value)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
            <input className={styles.input} value={draft.accent_color || ""} onChange={(e) => set("accent_color", e.target.value)} placeholder="#1e293b" maxLength={7} />
          </div>
          <p className={styles.hint}>{t("admin.cms.store_identity.accent_hint")}</p>
        </div>
        <LogoManager draft={draft} uploading={uploading} fileRef={fileRef} handleUpload={handleUpload} handleResetLogo={handleResetLogo} styles={styles} t={t} />
      </div>
    </SectionCard>
  );
};

const ContactField = ({ id, label, value, onChange, hint, styles, type = "text" }) => (
  <div className={styles.fieldGroup}>
    <label className={styles.label} htmlFor={id}>{label}</label>
    <input id={id} className={styles.input} type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} dir="ltr" />
    <p className={styles.hint}>{hint}</p>
  </div>
);

const IdentitySkeleton = ({ styles }) => (
  <div className={styles.skeletonWrap} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
    <Skeleton variant="rectangular" width="100%" height={100} style={{ borderRadius: 12 }} /><Skeleton variant="text" width="50%" height={30} />
    <Skeleton variant="rectangular" width="100%" height={80} style={{ borderRadius: 8 }} />
  </div>
);

export default StoreIdentity;
