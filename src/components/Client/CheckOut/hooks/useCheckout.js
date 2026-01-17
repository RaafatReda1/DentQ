import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast'; // Ensure react-hot-toast is installed
import { userContext } from '../../../../utils/AppContexts';
import useCartDataStorage from '../../../Storage/useCartDataStorage';
import { useFormatPrice } from '../../../../utils/Hooks/useFormatPrice';
import { fetchGovernorates, calculateShipping, confirmOrder } from '../Actions';
import HandlePromoCode from '../SubComponents/OrderSum/HandlePromoCode';

/**
 * Custom hook to handle Checkout Logic
 * Separates business logic from UI presentation.
 */
export const useCheckout = () => {
    const { t, i18n } = useTranslation();
    const [user] = useContext(userContext);
    const { totalPrice, cartItems } = useCartDataStorage();
    const formatPrice = useFormatPrice();

    const [governorates, setGovernorates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Promo code state
    const [promoCode, setPromoCode] = useState({
        code: '',
        isApplied: false,
        discountAmount: 0,
        discountType: null,
        discountValue: null,
        isLoading: false
    });

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        address: '',
        payment_method: 'cash_on_delivery',
        governorate_id: '',
        ...(user.id ? { client_id: user.id } : { guest_id: user.guest_id }),
        total_amount: 0,
        promocode_id: null
    });

    // Load initial data
    useEffect(() => {
        const loadCheckoutData = async () => {
            const govs = await fetchGovernorates();
            setGovernorates(govs);

            // Pre-fill user data if logged in
            if (user && user.session) {
                setFormData(prev => ({
                    ...prev,
                    full_name: user.fullName || '',
                    phone_number: user.phone || '',
                    governorate_id: user.governorateId || '',
                    address: user.address || ''
                }));
            }

            setLoading(false);
        };

        loadCheckoutData();
    }, [user]);

    // Handle Form Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentMethodChange = (method) => {
        setFormData(prev => ({ ...prev, payment_method: method }));
    };

    // Promo Code Handlers
    const handleApplyPromoCode = async (code) => {
        setPromoCode(prev => ({ ...prev, isLoading: true }));

        const result = await HandlePromoCode(code, user?.id, totalPrice);

        if (result.success) {
            setPromoCode({
                code: result.code,
                isApplied: true,
                discountAmount: result.discountAmount,
                discountType: result.discountType,
                discountValue: result.discountValue,
                isLoading: false
            });
            setFormData(prev => ({ ...prev, promocode_id: result.id }));
            toast.success(i18n.language === 'ar' ? result.message : result.messageEn);
        } else {
            setPromoCode(prev => ({ ...prev, isLoading: false }));
            setFormData(prev => ({ ...prev, promocode_id: null }));
            toast.error(i18n.language === 'ar' ? result.message : result.messageEn);
        }
    };

    const handleRemovePromoCode = () => {
        setPromoCode({
            code: '',
            isApplied: false,
            discountAmount: 0,
            discountType: null,
            discountValue: null,
            isLoading: false
        });
        setFormData(prev => ({ ...prev, promocode_id: null }));
        toast.success(t('checkout.promo_removed') || 'Promo code removed');
    };

    // Derived Calculations
    const shippingCost = calculateShipping(formData.governorate_id, governorates);
    // const totalAmount = totalPrice + shippingCost - promoCode.discountAmount; // Not used directly, but calculated for effect

    // Update form total_amount when dependencies change
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            total_amount: totalPrice + shippingCost - promoCode.discountAmount,
            discount: promoCode.discountAmount
        }));
    }, [totalPrice, shippingCost, promoCode.discountAmount]);

    // Order Submission
    const handleConfirmOrder = async () => {
        // Validation
        if (!formData.full_name || !formData.phone_number || !formData.governorate_id || !formData.address) {
            toast.error(t('checkout.fill_all_fields') || 'Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await confirmOrder(formData, cartItems);

            if (result) {
                // Reset form and promo code on success
                setPromoCode({
                    code: '',
                    isApplied: false,
                    discountAmount: 0,
                    discountType: null,
                    discountValue: null,
                    isLoading: false
                });

                // Reset ALL form fields to empty state
                setFormData(prev => ({
                    ...prev,
                    full_name: '',
                    phone_number: '',
                    governorate_id: '',
                    address: '',
                    payment_method: 'cash_on_delivery',
                    promocode_id: null,
                }));

                // Note: forceRerender is handled in Actions.js now, or we can do it here if we want to be explicit.
                // But since Actions.js has it, we rely on that or we can uncomment if needed.
                // window.forceRerender && window.forceRerender(); 
            }
        } catch (error) {
            console.error(error);
            toast.error(t('checkout.error_generic') || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Preparing display values
    const displayValues = {
        subtotal: formatPrice(totalPrice),
        shipping: formatPrice(shippingCost),
        discount: formatPrice(promoCode.discountAmount),
        total: formatPrice(totalPrice + shippingCost - promoCode.discountAmount),
    };

    const localizedGovernorates = governorates.map(g => ({
        id: g.id,
        label: i18n.language === 'ar' ? g.governorateAr : g.governorateEn
    }));

    return {
        // State
        user,
        loading,
        formData,
        promoCode,
        isSubmitting,
        governorates,
        localizedGovernorates,

        // Handlers
        handleChange,
        handlePaymentMethodChange,
        handleApplyPromoCode,
        handleRemovePromoCode,
        handleConfirmOrder,

        // Display
        displayValues,
        t
    };
};
