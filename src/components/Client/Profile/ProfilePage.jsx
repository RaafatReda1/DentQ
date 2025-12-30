import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../../utils/AppContexts';
import { fetchClientData, updateClientData, uploadProfilePicture } from './ProfileActions';
import styles from './ProfilePage.module.css';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit2,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useContext(userContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    email: '',
    phone: '',
    address: '',
    avatarUrl: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user && user.id) {
        const data = await fetchClientData(user.id);
        if (data) {
          setFormData({
            fullName: data.fullName || '',
            nickName: data.nickName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            avatarUrl: data.avatarUrl || ''
          });
        }
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // 1. Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setSaving(true);
    const publicUrl = await uploadProfilePicture(user.id, formData.fullName, file);
    if (publicUrl) {
      // Update DB immediately with new avatar URL
      const updated = await updateClientData(user.id, { avatarUrl: publicUrl });
      if (updated) {
        setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
        // Update global user context to reflect new avatar in header
        setUser(prev => ({ ...prev, avatarUrl: publicUrl }));
        setPreviewUrl(null); // Clear local preview once DB is updated
      }
    } else {
      setPreviewUrl(null); // Revert on failure
    }
    setSaving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updates = {
      fullName: formData.fullName,
      nickName: formData.nickName,
      phone: formData.phone,
      address: formData.address
    };

    const updated = await updateClientData(user.id, updates);
    if (updated) {
      setIsEditing(false);
      // Update global user context
      setUser(prev => ({
        ...prev,
        fullName: updated.fullName,
        nickName: updated.nickName
      }));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <Loader2 className={styles.loader} size={48} />
      </div>
    );
  }

  const currentDisplayAvatar = previewUrl || formData.avatarUrl;

  return (
    <div className={styles.profileContainer}>
      {/* Image Preview Modal */}
      {showModal && currentDisplayAvatar && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowModal(false)} aria-label="Close preview">
              <X size={24} />
            </button>
            <img src={currentDisplayAvatar} alt="Profile Preview" className={styles.modalImage} />
          </div>
        </div>
      )}

      <div className={styles.profileCard}>
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
                <User size={80} className={styles.avatarPlaceholder} />
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

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* Full Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('profile.full_name') || 'Full Name'}</label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} size={18} />
                <input
                  className={styles.input}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                  required
                />
              </div>
            </div>

            {/* Nickname */}
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('profile.nickname') || 'Nickname'}</label>
              <div className={styles.inputWrapper}>
                <Edit2 className={styles.inputIcon} size={18} />
                <input
                  className={styles.input}
                  type="text"
                  name="nickName"
                  value={formData.nickName}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />
              </div>
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('profile.phone') || 'Phone'}</label>
              <div className={styles.inputWrapper}>
                <Phone className={styles.inputIcon} size={18} />
                <input
                  className={styles.input}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('profile.email') || 'Email'}</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={18} />
                <input
                  className={styles.input}
                  type="email"
                  value={formData.email}
                  disabled={true}
                />
              </div>
            </div>

            {/* Address */}
            <div className={styles.formGroup + ' ' + styles.fullWidth}>
              <label className={styles.label}>{t('profile.address') || 'Address'}</label>
              <div className={styles.inputWrapper}>
                <MapPin className={styles.inputIcon} size={18} />
                <input
                  className={styles.input}
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default ProfilePage;