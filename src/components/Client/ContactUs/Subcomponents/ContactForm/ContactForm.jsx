import React, { useState } from 'react';
import styles from '../../ContactUs.module.css';
import { useTranslation } from 'react-i18next';
import { submitContactMessage } from '../../Actions';
import toast from 'react-hot-toast';

const ContactForm = ({ user }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    // Auto fill state if client session exists
    const [formData, setFormData] = useState({
        full_name: user?.fullName || '',
        email_address: user?.email || '',
        phone_number: user?.phone || '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            client_id: user?.id || null
        };

        const res = await submitContactMessage(payload);

        if (res.success) {
            toast.success(t("contact_us.success_message"));
            setFormData({ ...formData, message: '' }); // Clear message area
        } else {
            toast.error(t("contact_us.error_message"));
        }

        setLoading(false);
    };

    return (
        <div className={styles.formContainer}>
            <h2>{t("contact_us.get_in_touch")}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>{t("contact_us.full_name")}</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={styles.inputField}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>{t("contact_us.email_address")}</label>
                    <input
                        type="email"
                        name="email_address"
                        value={formData.email_address}
                        onChange={handleChange}
                        className={styles.inputField}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>{t("contact_us.phone_number")}</label>
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className={styles.inputField}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>{t("contact_us.message")}</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className={styles.textareaField}
                        required
                    ></textarea>
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? t("contact_us.sending") : t("contact_us.send_message")}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
