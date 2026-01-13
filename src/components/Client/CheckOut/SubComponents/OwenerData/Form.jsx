import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import ProfileSelect from '../../../Profile/subcomponents/ProfileSelect';
import styles from './OwenerData.module.css';

const Form = ({
    formData,
    handleChange,
    governorates,
    localizedGovernorates,
    t
}) => {
    return (
        <div className={styles.formSection}>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    <User size={16} />
                    {t('checkout.full_name') || 'Full Name'}
                </label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={t('checkout.enter_name') || 'Enter your full name'}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    <Phone size={16} />
                    {t('checkout.phone') || 'Phone Number'}
                </label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={t('checkout.enter_phone') || 'Enter your phone'}
                    required
                />
            </div>

            <ProfileSelect
                label={t('checkout.governorate') || 'Governorate'}
                name="governorateId"
                value={formData.governorateId}
                onChange={handleChange}
                icon={MapPin}
                options={localizedGovernorates}
                placeholder={t('checkout.select_governorate') || 'Select your governorate'}
            />

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    <MapPin size={16} />
                    {t('checkout.full_address') || 'Full Address'}
                </label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder={t('checkout.enter_address') || 'Street, building, floor...'}
                    rows={3}
                    required
                />
            </div>
        </div>
    );
};

export default Form;
