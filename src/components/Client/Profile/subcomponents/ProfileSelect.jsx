import React from 'react';
import styles from '../ProfilePage.module.css';

const ProfileSelect = ({
    label,
    name,
    value,
    onChange,
    icon: Icon,
    disabled,
    options,
    placeholder,
    className = ""
}) => {
    return (
        <div className={`${styles.formGroup} ${className}`}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputWrapper}>
                <Icon className={styles.inputIcon} size={18} />
                <select
                    className={styles.input}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={disabled}
                    style={{ appearance: 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ProfileSelect;
