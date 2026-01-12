import React from 'react';
import { User, Edit2, Phone, Mail, MapPin, Save, Loader2 } from 'lucide-react';
import ProfileField from './ProfileField';
import styles from '../ProfilePage.module.css';

const ProfileForm = ({
    formData,
    handleChange,
    handleSubmit,
    isEditing,
    setIsEditing,
    saving,
    t
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
                <ProfileField
                    label={t('profile.full_name') || 'Full Name'}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={User}
                    disabled={!isEditing || saving}
                    required
                />

                <ProfileField
                    label={t('profile.nickname') || 'Nickname'}
                    name="nickName"
                    value={formData.nickName}
                    onChange={handleChange}
                    icon={Edit2}
                    disabled={!isEditing || saving}
                />

                <ProfileField
                    label={t('profile.phone') || 'Phone'}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={Phone}
                    disabled={!isEditing || saving}
                    type="tel"
                />

                <ProfileField
                    label={t('profile.email') || 'Email'}
                    name="email"
                    value={formData.email}
                    onChange={() => { }}
                    icon={Mail}
                    disabled={true}
                    type="email"
                />

                <ProfileField
                    label={t('profile.address') || 'Address'}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    icon={MapPin}
                    disabled={!isEditing || saving}
                    className={styles.fullWidth}
                />
            </div>

            <div className={styles.actions}>
                {!isEditing ? (
                    <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => setIsEditing(true)}
                        disabled={saving}
                    >
                        <Edit2 size={18} />
                        {t('profile.edit') || 'Edit Profile'}
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => setIsEditing(false)}
                            disabled={saving}
                        >
                            {t('profile.cancel') || 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            className={styles.saveBtn}
                            disabled={saving}
                        >
                            {saving ? (
                                <Loader2 className={styles.spinner} size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {t('profile.save') || 'Save Changes'}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
};

export default ProfileForm;
