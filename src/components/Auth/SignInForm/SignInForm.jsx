import GoogleBtn from "../GoogleBtn/GoogleBtn";
import { useTranslation } from "react-i18next";

export const SignInForm = () => {
  const { t } = useTranslation();
  return (
    <>
      <span>{t('menu.login')}</span>
    </>
  );
};
