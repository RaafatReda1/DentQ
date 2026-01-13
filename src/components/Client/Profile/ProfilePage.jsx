import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../../utils/AppContexts';
import { fetchClientData, updateClientData, uploadProfilePicture, fetchGovernorates } from './ProfileActions';
import styles from './ProfilePage.module.css';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

// Sub-components
import GuestProfile from './subcomponents/GuestProfile';
import ProfileHeader from './subcomponents/ProfileHeader';
import ProfileForm from './subcomponents/ProfileForm';
import ProfileImageModal from './subcomponents/ProfileImageModal';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useContext(userContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [governorates, setGovernorates] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    email: '',
    phone: '',
    address: '',
    avatarUrl: '',
    governorateId: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user && user.id) {
        setLoading(true);
        const [data, govs] = await Promise.all([
          fetchClientData(user.id),
          fetchGovernorates()
        ]);

        if (govs) setGovernorates(govs);

        if (data) {
          setFormData({
            fullName: data.fullName || '',
            nickName: data.nickName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            avatarUrl: data.avatarUrl || '',
            governorateId: data.governorateId || ''
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

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setSaving(true);
    const publicUrl = await uploadProfilePicture(user.id, formData.fullName, file);
    if (publicUrl) {
      const updated = await updateClientData(user.id, { avatarUrl: publicUrl });
      if (updated) {
        setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
        setUser(prev => ({ ...prev, avatarUrl: publicUrl }));
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
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
      address: formData.address,
      governorateId: formData.governorateId
    };

    const updated = await updateClientData(user.id, updates);
    if (updated) {
      setIsEditing(false);
      setUser(prev => ({
        ...prev,
        fullName: updated.fullName,
        nickName: updated.nickName
      }));
    }
    setSaving(false);
  };

  if (!user || user.type !== 'client' || !user.session) {
    return (
      <div className={styles.profileContainer}>
        <GuestProfile t={t} />
      </div>
    );
  }

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
      {showModal && currentDisplayAvatar && (
        <ProfileImageModal
          imageUrl={currentDisplayAvatar}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className={styles.profileCard}>
        <ProfileHeader
          currentDisplayAvatar={currentDisplayAvatar}
          formData={formData}
          saving={saving}
          previewUrl={previewUrl}
          handleFileChange={handleFileChange}
          setShowModal={setShowModal}
          t={t}
        />

        <ProfileForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          saving={saving}
          governorates={governorates}
          t={t}
          i18n={i18n}
        />
      </div>
    </div>
  );
};

export default ProfilePage;