import React, { useState, useEffect } from "react";
import styles from "./PrivacyPage.module.css";
import { useTranslation } from "react-i18next";
import { useLogo } from "../../../utils/LogoContext";
import { supabase } from "../../../utils/SupabaseClient";
import { DEFAULT_LEGAL_PAGES } from "../../Admin/CMS/config/defaults";
import { Skeleton } from "@mui/material";

const PrivacyPage = () => {
  const { t, i18n } = useTranslation();
  const { logoUrl } = useLogo();
  const isLTR = i18n.language.startsWith("en");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from("LegalPages")
          .select("*")
          .eq("page_key", "privacy_policy")
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setContent(data);
        } else {
          // Fallback to default if not found
          const def = DEFAULT_LEGAL_PAGES.find(p => p.page_key === "privacy_policy");
          setContent(def);
        }
      } catch (err) {
        console.error("Error fetching Privacy Policy:", err);
        const def = DEFAULT_LEGAL_PAGES.find(p => p.page_key === "privacy_policy");
        setContent(def);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const title = t("privacy_page.title", "Privacy Policy");
  const displayText = isLTR ? content?.content_en : content?.content_ar;

  return (
    <div className={styles.pageContainer} dir={isLTR ? "ltr" : "rtl"}>
      <div className={styles.content}>
        <img src={logoUrl || '/logo.png'} alt="DentQ Logo" className={styles.logo} />
        <h1>{title}</h1>
        {loading ? (
          <div className={styles.skeletonWrap}>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="95%" height={24} />
            <Skeleton variant="text" width="98%" height={24} />
            <br />
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="90%" height={24} />
            <Skeleton variant="text" width="85%" height={24} />
            <br />
            <Skeleton variant="rectangular" width="100%" height={120} style={{ borderRadius: 8 }} />
          </div>
        ) : (
          <div className={styles.textContent}>
            <p style={{ whiteSpace: "pre-wrap" }}>{displayText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPage;