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
