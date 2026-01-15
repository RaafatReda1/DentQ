import validatePromoCode from "../../../../../utils/CheckPromoCodeValidity"

/**
 * Handles promo code validation and discount calculation
 * @param {string} code - The promo code entered by user
 * @param {string} userId - The user's ID for validation
 * @param {number} cartTotal - The cart subtotal (before shipping) to calculate percentage discounts
 * @returns {Promise<Object>} Result object with success status, discount amount, and metadata
 */
export default async function HandlePromoCode(code, userId, cartTotal) {
    const result = await validatePromoCode(code, userId);

    // Handle validation errors (code not found, expired, already used, etc.)
    if (!result.success) {
        return {
            success: false,
            message: result.message,
            messageEn: result.messageEn
        };
    }

    // Calculate discount based on type
    let discountAmount = 0;

    switch (result.data.type) {
        case "percentage":
            // Calculate percentage of cart total
            discountAmount = (cartTotal * result.data.discount) / 100;
            break;
        case "fixed":
            // Use fixed amount directly
            discountAmount = result.data.discount;
            break;
        default:
            discountAmount = 0;
    }

    // Return success with calculated discount and all metadata
    return {
        success: true,
        discountAmount,
        discountType: result.data.type,
        discountValue: result.data.discount,
        code: result.data.code,
        id: result.data.id,
        message: result.message,
        messageEn: result.messageEn
    };
}