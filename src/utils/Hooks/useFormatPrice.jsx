import { useTranslation } from "react-i18next";

export const useFormatPrice = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  return (amount) => { //عاوزك ترجعلي function لما انادي الهوك
    const num = Number(amount);

    return new Intl.NumberFormat(locale, {//بحيث ال function ده ترجعلي السعر النهائي بعد الفورمات
      style: "currency",
      currency: "EGP",
    }).format(isNaN(num) ? 0 : num);
  };
};
