import React from "react";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./MessageItem.module.css";

const MessageItem = ({ message, isSelected, onSelect, activeMarker, formatDate }) => {
  const { t } = useTranslation();
  const MarkerIcon = activeMarker?.icon;

  return (
    <div 
      className={`${styles.messageItem} ${isSelected ? styles.selectedItem : ""}`}
      onClick={() => onSelect(message)}
    >
      {!message.seen && <div className={styles.unreadDot} />}
      <div className={styles.itemHeader}>
        <span className={styles.senderName}>{message.full_name || "Anonymous"}</span>
        <span className={styles.timestamp}>{formatDate(message.created_at)}</span>
      </div>
      <p className={styles.snippet}>{message.message}</p>
      <div className={styles.itemIcons}>
        {activeMarker && (
          <div className={`${styles.markerBadge} ${activeMarker.className}`}>
            <MarkerIcon size={10} /> {t(`admin.cms.messages.${activeMarker.labelKey}`, activeMarker.id)}
          </div>
        )}
        {!message.seen && <Mail size={12} color="#3b82f6" />}
      </div>
    </div>
  );
};

export default MessageItem;
