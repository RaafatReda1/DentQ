import React, { useState, useEffect, useRef } from "react";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import { useStoreSettings, useUpsertStoreSettings } from "../hooks/cmsHooks";
import { uploadLogo } from "../api/cmsApi";
import { useLogo } from "../../../../utils/LogoContext";
import styles from "./StoreIdentity.module.css";
import { Upload, RotateCcw, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const StoreIdentity = () => {
  const { data: remote } = useStoreSettings();
  const { mutate: save, isPending: saving } = useUpsertStoreSettings();
  const { setLogoUrl } = useLogo();
  const [draft, setDraft] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (remote) setDraft(remote);
  }, [remote]);

  if (!draft) return <div className={styles.loading}>Loading store identity…</div>;

  const set = (key, val) => setDraft((p) => ({ ...p, [key]: val }));
  const isDirty = JSON.stringify(draft) !== JSON.stringify(remote);

  const handleSave = () => save(draft, { onSuccess: () => {} });
  const handleDiscard = () => setDraft(remote);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Logo must be under 2 MB"); return; }
    const allowed = ["image/png", "image/svg+xml", "image/webp"];
    if (!allowed.includes(file.type)) { toast.error("PNG, SVG or WEBP only"); return; }

    try {
      setUploading(true);
      const { publicUrl, storagePath } = await uploadLogo(file, draft.logo_storage_path);
      set("logo_url", publicUrl);
      set("logo_storage_path", storagePath);
      setLogoUrl(publicUrl); // update global context immediately
      toast.success("Logo uploaded — click Save to persist.");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleResetLogo = () => {
    set("logo_url", null);
    set("logo_storage_path", null);
    setLogoUrl(null); // revert context to /logo.png fallback immediately
    toast.success("Logo reset to default — click Save to persist.");
  };

  const handleResetToDefault = () => {
    setDraft({
      ...draft, // keep ID if it exists
      logo_url: null,
      logo_storage_path: null,
      accent_color: "#1a1a2e",
      phone: "",
      email: "",
      address_en: "",
      address_ar: "",
    });
    setLogoUrl(null);
    toast.success("Store identity reset to defaults — click Save to persist.");
  };

  const logoPreview = draft.logo_url || "/logo.png";

  return (
    <SectionCard
      id="store-identity"
      title="Store identity & contact info"
      subtitle="Core contact details used across checkout, invoices, and the storefront"
      saveLabel="Save changes"
      onSave={handleSave}
      onDiscard={handleDiscard}
      onResetToDefault={handleResetToDefault}
      saving={saving}
      isDirty={isDirty}
    >
      {/* Addresses */}
      <BilingualField
        label="Address"
        valueEn={draft.address_en}
        valueAr={draft.address_ar}
        onChangeEn={(v) => set("address_en", v)}
        onChangeAr={(v) => set("address_ar", v)}
        placeholderEn="123 Dental St., New Cairo, Egypt"
        placeholderAr="١٢٣ شارع طب الأسنان، القاهرة الجديدة"
        hint="Used on invoices and the storefront contact page"
      />

      {/* Phone + Email */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="store-phone">
            PHONE NUMBER
          </label>
          <input
            id="store-phone"
            className={styles.input}
            value={draft.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+20 100 123 4567"
            dir="ltr"
          />
          <p className={styles.hint}>Maps to <code>StoreSettings.phone</code></p>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="store-email">
            EMAIL
          </label>
          <input
            id="store-email"
            className={styles.input}
            type="email"
            value={draft.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            placeholder="hello@dentq.com"
            dir="ltr"
          />
          <p className={styles.hint}>Maps to <code>StoreSettings.email</code></p>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Brand Color + Logo */}
      <div className={styles.row}>
        {/* Accent Color */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>BRAND ACCENT COLOR</label>
          <div className={styles.colorRow}>
            <div
              className={styles.swatch}
              style={{ background: draft.accent_color || "#1e293b" }}
              onClick={() => document.getElementById("color-picker").click()}
              title="Click to pick color"
            />
            <input
              id="color-picker"
              type="color"
              value={draft.accent_color || "#1e293b"}
              onChange={(e) => set("accent_color", e.target.value)}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            />
            <input
              className={styles.input}
              value={draft.accent_color || ""}
              onChange={(e) => set("accent_color", e.target.value)}
              placeholder="#1e293b"
              maxLength={7}
            />
          </div>
          <p className={styles.hint}>Used on invoice headers, buttons, and UI highlights.</p>
        </div>

        {/* Logo */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>STORE LOGO</label>
          <div className={styles.logoRow}>
            <div className={styles.logoPreview}>
              <img src={logoPreview} alt="Store logo" className={styles.logoImg} />
            </div>
            <div className={styles.logoButtons}>
              <input
                ref={fileRef}
                type="file"
                accept=".png,.svg,.webp,image/png,image/svg+xml,image/webp"
                onChange={handleUpload}
                style={{ display: "none" }}
              />
              <button
                className={styles.uploadBtn}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 size={14} className={styles.spin} /> : <Upload size={14} />}
                {uploading ? "Uploading…" : "Upload new logo"}
              </button>
              {draft.logo_url && (
                <button className={styles.resetBtn} onClick={handleResetLogo} title="Reset to default /logo.png">
                  <RotateCcw size={13} /> Reset to default
                </button>
              )}
            </div>
          </div>
          <p className={styles.hint}>PNG, SVG, WEBP · max 2 MB · stored in Banners/LOGO/</p>
        </div>
      </div>
    </SectionCard>
  );
};

export default StoreIdentity;
