import React, { useState } from "react";
import styles from "./ForgotPasswordForm.module.css";
import { useTranslation } from "react-i18next";
import { resetPasswordAction } from "./Actions";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const ForgotPasswordForm = () => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        const { success, error } = await resetPasswordAction(email);
        setLoading(false);

        if (success) {
            setSuccessMsg(true);
            toast.success(t("auth.resetSent"));
        } else {
            toast.error(error || t("auth.resetError"));
        }
    };

    const isLTR = i18n.language.startsWith("en");

    return (
        <div className={[styles.container, 'authForm'].join(' ')}  dir={isLTR ? "ltr" : "rtl"}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("auth.forgotPassword")}</h1>
                <p className={styles.subtitle}>{t("auth.resetInstructions")}</p>
            </div>

            {!successMsg ? (
                <form onSubmit={handleSubmit} className={styles.formGroup}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t("auth.email")}</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            dir="ltr"
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading} style={{ marginTop: "1.5rem" }}>
                        {loading ? t("auth.loading") : t("auth.submitForgot")}
                    </button>
                </form>
            ) : (
                <div className={styles.successMessage}>
                    {t("auth.resetSent")}
                </div>
            )}

            <div className={styles.footer} style={{ marginTop: "2rem" }}>
                <Link to="/signin" className={styles.link}>
                    {t("auth.backToLogin")}
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
