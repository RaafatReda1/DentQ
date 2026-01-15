import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../../utils/AppContexts';
import { fetchGovernorates, calculateShipping, confirmOrder } from './Actions';
import OwnerData from './SubComponents/OwenerData/OwenerData';
import OrderSum from './SubComponents/OrderSum/OrderSum';
import styles from './CheckOut.module.css';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useCartDataStorage from '../../Storage/useCartDataStorage';
import { useFormatPrice } from '../../../utils/Hooks/useFormatPrice';
import HandlePromoCode from './SubComponents/OrderSum/HandlePromoCode';

function CheckOutPage() {
  const { t, i18n } = useTranslation();
  const [user] = useContext(userContext);
  const { totalPrice } = useCartDataStorage();
  const formatPrice = useFormatPrice();
  const [governorates, setGovernorates] = useState([]);
  const [loading, setLoading] = useState(true);

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
    full_name: '', //from the From.jsx input values directly
    phone_number: '',//from the From.jsx input values directly
    address: '',//from the From.jsx input values directly
    payment_method: 'cash_on_delivery', //static
    governorate_id: '',//from the From.jsx input values directly
    ...(user.id
      ? { client_id: user.id }
      : { guest_id: user.guest_id }
    ),
    total_amount: 0, //calculated down here in line 119 i suppose if no code edits
    promocode_id: null // from apply promocode function
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({ ...prev, payment_method: method }));
  };

  // Promo code handlers
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
    toast.success(t('checkout.promo_removed') || 'Promo code removed');
  };

  // Calculate totals
  const subtotal = formatPrice(totalPrice);
  const shippingCost = calculateShipping(formData.governorate_id, governorates);
  const shipping = formatPrice(shippingCost);
  const discount = formatPrice(promoCode.discountAmount);
  const total = formatPrice(totalPrice + shippingCost - promoCode.discountAmount);
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      total_amount: totalPrice + shippingCost - promoCode.discountAmount,
      discount: promoCode.discountAmount
    }));
  }, [totalPrice, shippingCost, promoCode.discountAmount]);
  const localizedGovernorates = governorates.map(g => ({
    id: g.id,
    label: i18n.language === 'ar' ? g.governorateAr : g.governorateEn
  }));

  const handleConfirmOrder = async () => {
    // Validation
    if (!formData.full_name || !formData.phone_number || !formData.governorate_id || !formData.address) {
      toast.error(t('checkout.fill_all_fields') || 'Please fill all required fields');
      return;
    }
    await confirmOrder(formData);
    // TODO: Create order in database
  };

  if (loading) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutWrapper}>
        <OwnerData
          user={user}
          formData={formData}
          handleChange={handleChange}
          handlePaymentMethodChange={handlePaymentMethodChange}
          governorates={governorates}
          localizedGovernorates={localizedGovernorates}
          t={t}
        />

        <OrderSum
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
          formData={formData}
          handleConfirmOrder={handleConfirmOrder}
          promoCode={promoCode}
          onApplyPromoCode={handleApplyPromoCode}
          onRemovePromoCode={handleRemovePromoCode}
          userId={user?.id}
          t={t}
        />
      </div>
    </div>
  );
}

export default CheckOutPage;
