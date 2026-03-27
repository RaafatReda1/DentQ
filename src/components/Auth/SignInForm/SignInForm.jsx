import React, { useState } from "react";
import styles from "./SignInForm.module.css";
import { useTranslation } from "react-i18next";
import { signInAction } from "./Actions";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleBtn from "../GoogleBtn/GoogleBtn";
import { Eye, EyeOff } from "lucide-react";

export const SignInForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const { success, error } = await signInAction(email, password);
    setLoading(false);

    if (success) {
      toast.success(t("auth.signInSuccess"));
      // Typically navigate to home or dashboard after successful login
      navigate("/");
    } else {
      if (error === "Email not confirmed") {
        toast.error(t("auth.emailNotConfirmed") || "Please confirm your email address before signing in.");
      } else {
        toast.error(error);
      }
    }
  };

  const isLTR = i18n.language.startsWith("en");

  return (
    <div className={[styles.container, 'authForm'].join(' ')} dir={isLTR ? "ltr" : "rtl"}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("auth.signIn")}</h1>
        <p className={styles.subtitle}>DentQ Dental Clinic</p>
      </div>

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

        <Link to="/forgot-password" className={styles.forgotPassword}>
          {t("auth.forgotPassword")}
        </Link>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? t("auth.loading") : t("auth.submitSignIn")}
        </button>
      </form>

      <div className={styles.divider}>{t("auth.orContinue")}</div>

      <GoogleBtn />

      <div className={styles.footer}>
        {t("auth.noAccount")}
        <Link to="/signup" className={styles.link}>
          {t("auth.signUp")}
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
