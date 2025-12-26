import React, { useState } from 'react';
import styles from "../ProductCommentSection.module.css";

const CommentForm = ({ onSubmit, loading, t, user }) => {
    const [text, setText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSubmit(text);
        if (success) setText("");
    };

    if (user.type !== "client" && user.type !== "admin") {
        return (
            <div className={styles.signInMsg}>
                {t("comments.signin_msg")}
            </div>
        );
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <textarea
                className={styles.textarea}
                placeholder={t("comments.placeholder")}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? t("comments.posting") : t("comments.post_btn")}
            </button>
        </form>
    );
};

export default CommentForm;
