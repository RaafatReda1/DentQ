import React from "react";
import { Mail, Phone, Clock, Flag, ChevronDown, Check, Trash2, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./MessageDetail.module.css";

const MessageDetail = ({ 
  message, 
  markers, 
  markerMenuOpen, 
  setMarkerMenuOpen, 
  markerRef, 
  onSetMarker, 
  onDelete, 
  formatDate 
}) => {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <>
      <div className={styles.detailHeader}>
        <div>
          <h2 className={styles.senderTitle}>{message.full_name || "Anonymous"}</h2>
          <div className={styles.senderMeta}>
            <div className={styles.metaItem}><Mail size={14} /> {message.email_address}</div>
            {message.phone_number && <div className={styles.metaItem}><Phone size={14} /> {message.phone_number}</div>}
            <div className={styles.metaItem}><Clock size={14} /> {formatDate(message.created_at)}</div>
          </div>
        </div>
        <div className={styles.detailActions}>
          <div className={styles.markerDropdown} ref={markerRef}>
            <button 
              className={`${styles.actionBtn} ${message.mark ? styles.starBtnActive : ""}`}
              onClick={() => setMarkerMenuOpen(!markerMenuOpen)}
              title="Set Status Marker"
            >
              {(() => {
                const marker = markers.find(m => m.id === message.mark);
                const ActiveIcon = marker ? marker.icon : Flag;
                return <ActiveIcon size={18} />;
              })()}
              <ChevronDown size={12} style={{ marginLeft: 4 }} />
            </button>
            {markerMenuOpen && (
              <div className={styles.markerMenu}>
                <button className={`${styles.markerOption} ${!message.mark ? styles.activeMarker : ""}`} onClick={() => onSetMarker(message.id, null)}>
                  <Check size={14} /> No Marker
                </button>
                {markers.map(m => {
                  const MIcon = m.icon;
                  return (
                    <button key={m.id} className={`${styles.markerOption} ${message.mark === m.id ? styles.activeMarker : ""}`} onClick={() => onSetMarker(message.id, m.id)}>
                      <MIcon size={14} color={m.color} /> {t(`admin.cms.messages.${m.labelKey}`, m.id)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(message.id)}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className={styles.messageBody}>{message.message}</div>
      <div className={styles.replyArea}>
        <a 
          href={`mailto:${message.email_address}?subject=Response from DentQ Support&body=Hello ${message.full_name},%0D%0A%0D%0A Regarding your message: "${message.message.substring(0, 50)}..."%0D%0A%0D%0A`}
          className={styles.replyBtn}
        >
          <ArrowUpRight size={18} /> {t("admin.cms.messages.reply", "Reply via Email")}
        </a>
      </div>
    </>
  );
};

export default MessageDetail;
