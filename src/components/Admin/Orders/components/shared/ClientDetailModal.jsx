import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  X, User, Mail, Phone, MapPin, Globe, UserCheck, ShieldQuestion
} from "lucide-react";
import styles from "./ClientDetailModal.module.css";
import { supabase } from "../../../../../utils/SupabaseClient";

const ClientDetailModal = ({ isOpen, onClose, client, isGuest }) => {
  const { t, i18n } = useTranslation();
  const [govName, setGovName] = useState(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;
    const govId = client?.governorateId; // Standardized property name

    if (isOpen && govId) {
      setGovName(null);
      const fetchGov = async () => {
        try {
          const { data, error } = await supabase
            .from("GovernoratesShipping")
            .select("governorateEn, governorateAr")
            .eq("id", govId);

          if (data?.[0] && isMounted) {
            const name = i18n.language === 'ar' ? data[0].governorateAr : data[0].governorateEn;
            setGovName(name);
          }
        } catch (err) {
          console.error("Failed to fetch governorate:", err);
        }
      };
      fetchGov();
    }

    return () => { isMounted = false; };
  }, [isOpen, client?.governorateId, i18n.language]);

  if (!isOpen) return null;

  const ProfileField = ({ icon, label, value, href }) => (
    <div className={styles.fieldBox}>
      <div className={styles.fieldIcon}>{icon}</div>
      <div className={styles.fieldText}>
        <span className={styles.fieldLabel}>{label}</span>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className={styles.fieldValueLink}>{value}</a>
        ) : (
          <span className={styles.fieldValue}>{value || "—"}</span>
        )}
      </div>
    </div>
  );

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
          <div className={styles.banner}>
            <div className={`${styles.avatar} ${isGuest ? styles.guestAvatar : ""}`}>
              {client.avatarUrl ? <img src={client.avatarUrl} alt="" /> : <User size={40} />}
            </div>
            <div className={styles.bannerText}>
              <h3>{client.fullName || t("admin.carts.guest", "Guest User")}</h3>
              <div className={styles.badgeRow}>
                {isGuest ? (
                  <span className={styles.guestBadge}><ShieldQuestion size={12} /> GUEST</span>
                ) : (
                  <span className={styles.userBadge}><UserCheck size={12} /> REGISTERED</span>
                )}
                {client.nickName && <span className={styles.nickName}>@{client.nickName}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h4>{t("profile.contact_info", "Contact Information")}</h4>
            <div className={styles.grid}>
              <ProfileField icon={<Mail size={16} />} label={t("profile.email", "Email Address")} value={client.email} href={client.email ? `mailto:${client.email}` : null} />
              <ProfileField icon={<Phone size={16} />} label={t("profile.phone", "Phone Number")} value={client.phone} href={client.phone ? `tel:${client.phone}` : null} />
            </div>
          </div>

          <div className={styles.section}>
            <h4>{t("profile.shipping_details", "Shipping Details")}</h4>
            <div className={styles.grid}>
              <ProfileField icon={<MapPin size={16} />} label={t("profile.address", "Address")} value={client.address} />
              <ProfileField icon={<Globe size={16} />} label={t("profile.governorate", "Governorate")} value={govName || t('common.loading', 'Loading...')} />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.primaryBtn} onClick={onClose}>{t("common.close", "Close Profile")}</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ClientDetailModal;
