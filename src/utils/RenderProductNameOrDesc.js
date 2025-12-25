import { useTranslation } from "react-i18next";
// بص يسطا ال finction ده وظيفتها استخراج الاسم او الوصف بتاع المنتج علي حسب لغة الموقع الحاليه وبتاخد 2 parameters
//1st parameter is the product itself with all it's data and the type u want to render wheather it's name or description and the fn will display the needed data type in the app's current language
const RenderProductNameOrDesc = (product, type) =>{
    const { i18n } = useTranslation();
    const name = i18n.language === "en" ? product.nameEn : product.nameAr;
    const desc = i18n.language === "en" ? product.descriptionEn : product.descriptionAr;
    const fullDesc = i18n.language === "en" ? product.fullDescriptionEn : product.fullDescriptionAr;
    return type === "name" ? name : type === "desc" ? desc : fullDesc;
}
export default RenderProductNameOrDesc;