import React from 'react';
import { X } from 'lucide-react';
import styles from '../ProfilePage.module.css';

const ProfileImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeModal} onClick={onClose} aria-label="Close preview">
                    <X size={24} />
                </button>
                <img src={imageUrl} alt="Profile Preview" className={styles.modalImage} />
            </div>
        </div>
    );
};

export default ProfileImageModal;
