import React, { useState, useEffect, useContext } from 'react';
import { userContext } from '../../../utils/AppContexts';
import { fetchGovernorates, calculateShipping } from './Actions';
import OwnerData from './SubComponents/OwenerData/OwenerData';
import OrderSum from './SubComponents/OrderSum/OrderSum';
import styles from './CheckOut.module.css';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import useCartDataStorage from '../../Storage/useCartDataStorage';
import { useFormatPrice } from '../../../utils/Hooks/useFormatPrice';

function CheckOutPage() {
  const { t, i18n } = useTranslation();
  const [user] = useContext(userContext);
  const {totalPrice} = useCartDataStorage();
  const formatPrice = useFormatPrice();
  const [governorates, setGovernorates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    governorateId: '',
    address: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    const loadCheckoutData = async () => {
      const govs = await fetchGovernorates();
      setGovernorates(govs);

      // Pre-fill user data if logged in
      if (user && user.session) {
        setFormData(prev => ({
          ...prev,
          fullName: user.fullName || '',
          phone: user.phone || '',
          governorateId: user.governorateId || '',
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
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  // Calculate totals
  const subtotal = formatPrice(totalPrice);
  const shipping = formatPrice(calculateShipping(formData.governorateId, governorates));
  const total = formatPrice(totalPrice + calculateShipping(formData.governorateId, governorates));

  const localizedGovernorates = governorates.map(g => ({
    id: g.id,
    label: i18n.language === 'ar' ? g.governorateAr : g.governorateEn
  }));

  const handleConfirmOrder = () => {
    // Validation
    if (!formData.fullName || !formData.phone || !formData.governorateId || !formData.address) {
      toast.error(t('checkout.fill_all_fields') || 'Please fill all required fields');
      return;
    }

    toast.success(t('checkout.order_confirmed') || 'Order confirmed! (Demo)');
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
          total={total}
          formData={formData}
          handleConfirmOrder={handleConfirmOrder}
          t={t}
        />
      </div>
    </div>
  );
}

export default CheckOutPage;
