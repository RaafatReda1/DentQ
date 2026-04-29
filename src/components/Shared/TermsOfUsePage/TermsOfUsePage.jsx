import React, { useState, useEffect } from "react";
import styles from "./TermsOfUsePage.module.css";
import { useTranslation } from "react-i18next";
import { useLogo } from "../../../utils/LogoContext";
import { supabase } from "../../../utils/SupabaseClient";
import { DEFAULT_LEGAL_PAGES } from "../../Admin/CMS/config/defaults";

const TermsOfUsePage = () => {
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
          .eq("page_key", "terms_of_use")
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setContent(data);
        } else {
          // Fallback to default if not found
          const def = DEFAULT_LEGAL_PAGES.find(p => p.page_key === "terms_of_use");
          setContent(def);
        }
      } catch (err) {
        console.error("Error fetching Terms of Use:", err);
        const def = DEFAULT_LEGAL_PAGES.find(p => p.page_key === "terms_of_use");
        setContent(def);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const title = t("terms_page.title", "Terms and Conditions");
  const displayText = isLTR ? content?.content_en : content?.content_ar;

  return (
    <div className={styles.pageContainer} dir={isLTR ? "ltr" : "rtl"}>
      <div className={styles.content}>
        <img src={logoUrl || '/logo.png'} alt="DentQ Logo" className={styles.logo} />
        <h1>{title}</h1>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.textContent}>
            <p style={{ whiteSpace: "pre-wrap" }}>{displayText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsOfUsePage;