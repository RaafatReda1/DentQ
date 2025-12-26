import React, { useState } from 'react';
import styles from "../ProductCommentSection.module.css";
import UserAvatar from "./UserAvatar";

const CommentItem = ({ comment, user, userProfile, t, onEdit, onDelete }) => {
    const isOwner = user.id === comment.clientId;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.comment);

    const displayName = userProfile?.fullName || comment.clientName;
    const displayAvatar = userProfile?.avatarUrl || comment.avatarUrl;

    const handleSave = () => {
        onEdit(comment.id, editContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditContent(comment.comment);
    };

    return (
        <div className={styles.commentItem}>
            <UserAvatar avatarUrl={displayAvatar} displayName={displayName} />

            <div className={styles.commentContent}>
                <div className={styles.header}>
                    <span className={styles.clientName}>{displayName}</span>
                    <span className={styles.date}>
                        {new Date(comment.date).toLocaleDateString()}
                        {comment.updatedAt && <span style={{ fontSize: '0.75rem', marginLeft: '5px' }}>({t("comments.updated")})</span>}
                    </span>
                </div>

                {isEditing ? (
                    <div className={styles.editForm}>
                        <textarea
                            className={styles.editTextarea}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className={styles.editButtons}>
                            <button className={styles.saveBtn} onClick={handleSave}>{t("comments.save")}</button>
                            <button className={styles.cancelBtn} onClick={handleCancel}>{t("comments.cancel")}</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={styles.text}>{comment.comment}</p>
                        {isOwner && (
                            <div className={styles.actions}>
                                <button className={styles.actionBtn} onClick={() => setIsEditing(true)}>{t("comments.edit")}</button>
                                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(comment.id)}>{t("comments.delete")}</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
