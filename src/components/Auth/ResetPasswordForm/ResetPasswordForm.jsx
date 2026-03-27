import React, { useState } from "react";
import styles from "./ResetPasswordForm.module.css";
import { useTranslation } from "react-i18next";
import { resetPasswordUpdateAction } from "./Actions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export const ResetPasswordForm = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) return;

        if (password !== confirmPassword) {
            toast.error(t("auth.passwordsNotMatch") || "Passwords do not match");
            return;
        }

        setLoading(true);
        const { success, error } = await resetPasswordUpdateAction(password);
        setLoading(false);

        if (success) {
            toast.success(t("auth.resetSuccess") || "Password has been successfully reset!");
            navigate("/signin");
        } else {
            toast.error(error || t("auth.resetError"));
        }
    };

    const isLTR = i18n.language && i18n.language.startsWith("en");

    return (
        <div className={styles.container} dir={isLTR ? "ltr" : "rtl"}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t("auth.resetPassword") || "Reset Password"}</h1>
                <p className={styles.subtitle}>{t("auth.enterNewPassword") || "Enter your new password below"}</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGroup}>
                <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                    <label className={styles.label}>{t("auth.password")}</label>
                    <div className={styles.passwordWrapper} dir="ltr">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={styles.passwordInput}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
                    <label className={styles.label}>{t("auth.confirmPassword")}</label>
                    <div className={styles.passwordWrapper} dir="ltr">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={styles.passwordInput}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading} style={{ marginTop: "1.5rem" }}>
                    {loading ? t("auth.loading") : (t("auth.submitReset") || "Update Password")}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
