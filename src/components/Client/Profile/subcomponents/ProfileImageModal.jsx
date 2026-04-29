import { useTranslation } from "react-i18next";
import React from 'react';
import { X } from 'lucide-react';
import styles from '../ProfilePage.module.css';

const ProfileImageModal = ({ imageUrl, onClose }) => {
  const { t } = useTranslation();
    if (!imageUrl) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeModal} onClick={onClose} aria-label={t("client.profile.close_preview", "Close preview")}>
                    <X size={24} />
                </button>
                <img src={imageUrl} alt="Profile Preview" className={styles.modalImage} />
            </div>
        </div>
    );
};

export default ProfileImageModal;
