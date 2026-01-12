import React from 'react';
import { Camera, Loader2 } from 'lucide-react';
import styles from '../ProfilePage.module.css';

const ProfileHeader = ({
    currentDisplayAvatar,
    formData,
    saving,
    previewUrl,
    handleFileChange,
    setShowModal,
    t
}) => {
    return (
        <div className={styles.header}>
            <div className={styles.avatarSection}>
                <div
                    className={styles.avatarWrapper}
                    onClick={() => currentDisplayAvatar && setShowModal(true)}
                    title="Click to view full size"
                >
                    {currentDisplayAvatar ? (
                        <img src={currentDisplayAvatar} alt="Avatar" className={styles.avatar} />
                    ) : (
                        <img src="/blank-user.png" alt="Default Avatar" className={styles.avatar} />
                    )}
                    {saving && previewUrl && (
                        <div className={styles.savingOverlay}>
                            <Loader2 className={styles.spinner} size={32} />
                        </div>
                    )}
                </div>
                <label className={styles.uploadOverlay} htmlFor="avatar-upload">
                    <Camera size={20} />
                    <input
                        type="file"
                        id="avatar-upload"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={saving}
                    />
                </label>
            </div>
            <h1 className={styles.title}>{formData.fullName || t('menu.doctor')}</h1>
            <p className={styles.subtitle}>{formData.email}</p>
        </div>
    );
};

export default ProfileHeader;
