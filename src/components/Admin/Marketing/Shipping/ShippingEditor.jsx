import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Truck } from "lucide-react";
import { useShippingQuery } from "../hooks/useShippingQuery";
import { useShippingMutations } from "../hooks/useShippingMutations";
import ShippingTable from "./components/ShippingTable";
import ShippingModal from "./components/ShippingModal";
import styles from "./ShippingEditor.module.css";

const ShippingEditor = () => {
  const { t } = useTranslation();
  const { data: rates = [], isLoading } = useShippingQuery();
  const { create, update, remove } = useShippingMutations();
  const [modal, setModal] = useState({ isOpen: false, rate: null });

  const handleSave = (formData) => {
    if (modal.rate) update.mutate({ id: modal.rate.id, updates: formData });
    else create.mutate(formData);
    setModal({ isOpen: false, rate: null });
  };

  const handleDelete = (id) => {
    if (window.confirm(t("admin.marketing.shipping.delete_confirm", "Are you sure?"))) remove.mutate(id);
  };

  if (isLoading) return <div className={styles.loading}>{t("common.loading", "Loading rates...")}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}><Truck size={20} /></div>
          <div>
            <h2 className={styles.title}>{t("admin.marketing.shipping.title", "Shipping Management")}</h2>
            <p className={styles.subtitle}>{t("admin.marketing.shipping.subtitle", "Set custom shipping prices for each governorate")}</p>
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => setModal({ isOpen: true, rate: null })}>
          <Plus size={16} /> {t("admin.marketing.shipping.add_new", "New Governorate")}
        </button>
      </div>

      <ShippingTable 
        rates={rates} 
        onEdit={(rate) => setModal({ isOpen: true, rate })} 
        onDelete={handleDelete} 
        t={t} 
      />

      <ShippingModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ isOpen: false, rate: null })} 
        onSave={handleSave} 
        editingRate={modal.rate} 
        t={t} 
      />
    </div>
  );
};

export default ShippingEditor;
