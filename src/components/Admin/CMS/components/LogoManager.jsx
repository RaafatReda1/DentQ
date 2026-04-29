import React from "react";
import { Upload, RotateCcw, Loader2 } from "lucide-react";

const LogoManager = ({ draft, uploading, fileRef, handleUpload, handleResetLogo, styles, t }) => {
  const logoPreview = draft.logo_url || "/logo.png";
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{t("admin.cms.store_identity.logo")}</label>
      <div className={styles.logoRow}>
        <div className={styles.logoPreview}><img src={logoPreview} alt="Logo" className={styles.logoImg} /></div>
        <div className={styles.logoButtons}>
          <input ref={fileRef} type="file" accept=".png,.svg,.webp" onChange={handleUpload} style={{ display: "none" }} />
          <button className={styles.uploadBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={14} className={styles.spin} /> : <Upload size={14} />}
            {uploading ? t("admin.cms.store_identity.uploading") : t("admin.cms.store_identity.upload_logo")}
          </button>
          {draft.logo_url && (
            <button className={styles.resetBtn} onClick={handleResetLogo}><RotateCcw size={13} /> {t("admin.cms.store_identity.reset_logo")}</button>
          )}
        </div>
      </div>
      <p className={styles.hint}>{t("admin.cms.store_identity.logo_hint")}</p>
    </div>
  );
};

export default LogoManager;
