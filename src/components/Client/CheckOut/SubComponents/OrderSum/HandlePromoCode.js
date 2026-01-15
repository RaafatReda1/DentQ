import validatePromoCode from "../../../../../utils/CheckPromoCodeValidity"

export default async function HandlePromoCode (code, userId) {
    const result = await validatePromoCode(code, userId)
    
    if(result.success){
        let discount = 0;
        switch (result.data.type) {
            case "percentage":
                discount 
            case "fixed":
                return result.data.discount
        }
}
}   