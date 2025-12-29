import { useTranslation } from "react-i18next";

  export const useFormatPrice = (amount) => {
    const num = Number(amount);
    const { i18n } = useTranslation();
    const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "EGP", // Assuming EGP based on your previous code
    }).format(isNaN(num) ? 0 : num);
  };