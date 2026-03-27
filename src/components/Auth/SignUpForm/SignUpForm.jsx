import React, { useState } from "react";
import styles from "./SignUpForm.module.css";
import { useTranslation } from "react-i18next";
import { signUpAction } from "./Actions";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleBtn from "../GoogleBtn/GoogleBtn";
import { Eye, EyeOff } from "lucide-react";

export const SignUpForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName || !confirmPassword) return;

    if (password !== confirmPassword) {
      toast.error(t("auth.passwordsNotMatch"));
      return;
    }

    setLoading(true);
    const { success, error, user, session } = await signUpAction(email, password, fullName);
    setLoading(false);

    if (success) {
      if (user?.identities && user.identities.length === 0) {
        toast.error(t("auth.emailAlreadyInUse") || "Email already in use. Please sign in.");
      } else if (!session) {
        toast.success(t("auth.checkEmail") || "Please check your email to confirm your account.");
      } else {
        toast.success(t("auth.signUpSuccess"));
        navigate("/");
      }
    } else {
      toast.error(error);
    }
  };

  const isLTR = i18n.language.startsWith("en");

  return (
    <div className={styles.container} dir={isLTR ? "ltr" : "rtl"}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("auth.signUp")}</h1>
        <p className={styles.subtitle}>DentQ B2B Market</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGroup}>
        <div className={styles.formGroup}>
          <label className={styles.label}>{t("auth.fullName")}</label>
          <input
            type="text"
            className={styles.input}
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            dir="auto"
          />
        </div>

        <div className={styles.formGroup} style={{ marginTop: "1rem" }}>
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
          {loading ? t("auth.loading") : t("auth.submitSignUp")}
        </button>
      </form>

      <div className={styles.divider}>{t("auth.orContinue")}</div>

      <GoogleBtn />

      <div className={styles.footer}>
        {t("auth.hasAccount")}
        <Link to="/signin" className={styles.link}>
          {t("auth.signIn")}
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;