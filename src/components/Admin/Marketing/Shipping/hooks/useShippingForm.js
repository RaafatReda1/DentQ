import { useState, useEffect } from "react";

export const useShippingForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    governorateEn: "",
    governorateAr: "",
    shippingPrice: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        governorateEn: initialData.governorateEn || "",
        governorateAr: initialData.governorateAr || "",
        shippingPrice: initialData.shippingPrice || 0,
      });
    } else {
      setFormData({ governorateEn: "", governorateAr: "", shippingPrice: 0 });
    }
  }, [initialData]);

  const setField = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  return { formData, setField, setFormData };
};
