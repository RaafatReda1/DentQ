/**
 * @file UserAvatar.jsx
 * @description A reusable component for displaying a user's profile picture.
 * It handles the logic for:
 * 1. Displaying the image if `avatarUrl` is provided.
 * 2. Falling back to a default "User" icon icon if the URL is missing or the image fails to load (onError).
 * 
 * @param {Object} props
 * @param {string} props.avatarUrl - The URL of the user's avatar image.
 * @param {string} props.displayName - The user's name (used for alt text).
 * @param {number} [props.size=20] - Size of the fallback icon.
 */
import React from 'react';
import { User } from "lucide-react";
import styles from "../ProductCommentSection.module.css";

const UserAvatar = ({ avatarUrl, displayName, size = 20 }) => {
    return (
        <div className={styles.avatarWrapper}>
            {avatarUrl ? (
                <>
                    <img
                        src={avatarUrl}
                        alt={displayName}
                        className={styles.avatar}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                    />
                    <div className={`${styles.avatar} ${styles.avatarPlaceholder}`} style={{ display: 'none' }}>
                        <User size={size} color="#666" />
                    </div>
                </>
            ) : (
                <div className={`${styles.avatar} ${styles.avatarPlaceholder}`}>
                    <User size={size} color="#666" />
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
