import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SectionCard from "../components/SectionCard";
import BilingualField from "../components/BilingualField";
import IconPickerModal from "../components/IconPickerModal";
import FooterPreview from "../components/FooterPreview";
import FooterLinks from "../components/FooterLinks";
import FooterSkeleton from "../components/FooterSkeleton";
import { useFooter, useUpsertFooter, useNavItems } from "../hooks/cmsHooks";
import { useLogo } from "../../../../utils/LogoContext";
import { DEFAULT_FOOTER } from "../config/defaults";
import styles from "./FooterEditor.module.css";

const FooterEditor = () => {
  const { t } = useTranslation();
  const { data: remote, isLoading } = useFooter();
  const { data: navItems } = useNavItems();
  const { logoUrl } = useLogo();
  const { mutate: save, isPending: saving } = useUpsertFooter();
  const [draft, setDraft] = useState(null);
  const [pickerOpenFor, setPickerOpenFor] = useState(null);

  useEffect(() => {
    if (!isLoading) setDraft(remote ? { ...remote, Links: remote.Links || [] } : { ...DEFAULT_FOOTER });
  }, [remote, isLoading]);

  if (isLoading || !draft) return <FooterSkeleton styles={styles} />;

  const isDirty = JSON.stringify(draft) !== JSON.stringify(remote ? { ...remote, Links: remote.Links || [] } : DEFAULT_FOOTER);
  const set = (key, val) => setDraft((p) => ({ ...p, [key]: val }));
  const handleSave = () => save({ id: draft.id, slogan_en: draft.slogan_en, slogan_ar: draft.slogan_ar, Links: draft.Links });
  const updateLink = (i, f, v) => {
    const l = [...draft.Links]; l[i] = { ...l[i], [f]: v }; set("Links", l);
  };

  return (
    <SectionCard id="footer-editor" title={t("admin.cms.footer.title")} subtitle={t("admin.cms.footer.subtitle")} 
      saveLabel={t("admin.cms.common.save")} onSave={handleSave} onDiscard={() => setDraft(remote ? { ...remote, Links: remote.Links || [] } : { ...DEFAULT_FOOTER })}
      onResetToDefault={() => setDraft({ ...DEFAULT_FOOTER })} saving={saving} isDirty={isDirty}>
      <FooterPreview draft={draft} navItems={navItems} logoUrl={logoUrl} />
      <hr className={styles.divider} />
      <BilingualField label={t("admin.cms.footer.slogan")} valueEn={draft.slogan_en} valueAr={draft.slogan_ar}
        onChangeEn={(v) => set("slogan_en", v)} onChangeAr={(v) => set("slogan_ar", v)}
        placeholderEn={t("admin.cms.footer.slogan_en_ph")} placeholderAr={t("admin.cms.footer.slogan_ar_ph")} />
      <FooterLinks draft={draft} set={set} updateLink={updateLink} setPickerOpenFor={setPickerOpenFor} styles={styles} t={t} />
      {pickerOpenFor !== null && (
        <IconPickerModal isOpen={true} onClose={() => setPickerOpenFor(null)} 
          selectedKey={draft.Links[pickerOpenFor]?.iconKey} onSelect={(key) => updateLink(pickerOpenFor, "iconKey", key)} />
      )}
    </SectionCard>
  );
};

export default FooterEditor;
