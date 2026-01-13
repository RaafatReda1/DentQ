import React from 'react';
import styles from './ProfileSelect.module.css';

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
        <div className={`${styles.selectGroup} ${className}`}>
            <label className={styles.selectLabel}>{label}</label>
            <div className={styles.selectWrapper}>
                <Icon className={styles.selectIcon} size={18} />
                <select
                    className={styles.selectInput}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={disabled}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className={styles.selectArrow}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default ProfileSelect;
