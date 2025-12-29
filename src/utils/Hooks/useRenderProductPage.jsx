// البتاع ده يسطا وظيفته يغير لينك الصفحة الى صفحة المنتج وعملته jsx مش js عشان مينفعش تستخدم رياكت هوك زي usenavigate خارج كومبوننت
import { useNavigate } from "react-router-dom";

export function useRenderProductPage() {
  const navigate = useNavigate();

  const toSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-]/g, "");

  return (proNameEn, proId) => {
    navigate(`/${toSlug(proNameEn)}/dp/${proId}`);
  };
}
