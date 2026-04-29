import { useState, useEffect, useRef } from "react";
import { useStoreSettings, useUpsertStoreSettings } from "../hooks/cmsHooks";
import { uploadLogo } from "../api/cmsApi";
import { DEFAULT_STORE } from "../config/defaults";
import { useLogo } from "../../../../utils/LogoContext";
import toast from "react-hot-toast";

export const useStoreIdentity = () => {
  const { data: remote } = useStoreSettings();
  const { mutate: save, isPending: saving } = useUpsertStoreSettings();
  const { setLogoUrl } = useLogo();
  const [draft, setDraft] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (remote) setDraft(remote);
    else setDraft(DEFAULT_STORE);
  }, [remote]);

  const set = (key, val) => setDraft((p) => ({ ...p, [key]: val }));
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) { toast.error("File error or size > 2MB"); return; }
    try {
      setUploading(true);
      const { publicUrl, storagePath } = await uploadLogo(file, draft.logo_storage_path);
      set("logo_url", publicUrl); set("logo_storage_path", storagePath);
      setLogoUrl(publicUrl);
    } catch (err) { toast.error("Upload failed: " + err.message); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleResetToDefault = () => {
    setDraft({ ...draft, logo_url: null, logo_storage_path: null, accent_color: "#1a1a2e", phone: "", email: "", address_en: "", address_ar: "" });
    setLogoUrl(null);
  };

  return { 
    draft, remote, saving, uploading, fileRef, set, 
    handleSave: () => save(draft), 
    handleDiscard: () => setDraft(remote),
    handleUpload,
    handleResetLogo: () => { set("logo_url", null); set("logo_storage_path", null); setLogoUrl(null); },
    handleResetToDefault
  };
};
