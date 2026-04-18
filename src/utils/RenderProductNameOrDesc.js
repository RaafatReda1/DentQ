const RenderProductNameOrDesc = (product, type, language) => {
    if (!product) return "";
    
    const isAr = language === "ar";
    
    if (type === "name") {
        return isAr ? (product.nameAr || product.nameEn || "") : (product.nameEn || product.nameAr || "");
    }
    
    if (type === "desc") {
        return isAr ? (product.descriptionAr || product.descriptionEn || "") : (product.descriptionEn || product.descriptionAr || "");
    }
    
    if (type === "fullDesc") {
        return isAr ? (product.fullDescriptionAr || product.fullDescriptionEn || "") : (product.fullDescriptionEn || product.fullDescriptionAr || "");
    }
    
    return "";
};

export default RenderProductNameOrDesc;