// Utility function to extract product name or description based on language
// Parameters:
// 1. product - the product object with all its data
// 2. type - 'name', 'desc', or 'fullDesc' to specify which field to render
// 3. language - current language code ('en' or 'ar')
const RenderProductNameOrDesc = (product, type, language) => {
    const name = language === "en" ? product.nameEn : product.nameAr;
    const desc = language === "en" ? product.descriptionEn : product.descriptionAr;
    const fullDesc = language === "en" ? product.fullDescriptionEn : product.fullDescriptionAr;
    return type === "name" ? name : type === "desc" ? desc : fullDesc;
}
export default RenderProductNameOrDesc;