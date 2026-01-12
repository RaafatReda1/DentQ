import React from 'react';
import styles from '../ProfilePage.module.css';

const ProfileField = ({
    label,
    name,
    value,
    onChange,
    disabled,
    required,
    type = "text",
    className = ""
}) => {
    return (
        <div className={`${styles.formGroup} ${className}`}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputWrapper}>
                <Icon className={styles.inputIcon} size={18} />
                <input
                    className={styles.input}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                />
            </div>
        </div>
    );
};

export default ProfileField;
