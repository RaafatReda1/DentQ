import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { usePromoCodesQuery } from "../hooks/usePromoCodesQuery";
import { usePromoCodeMutations } from "../hooks/usePromoCodeMutations";
import PromoStatsBar from "./PromoStatsBar";
import PromoTable from "./PromoTable";
import PromoModal from "./PromoModal";
import styles from "./PromoCodes.module.css";

const PromoCodes = () => {
  const { t } = useTranslation();
  const { promoCodes, isLoading, stats } = usePromoCodesQuery();
  const { createMutation, updateMutation, deleteMutation } = usePromoCodeMutations();

  const [modalState, setModalState] = useState({ open: false, editData: null });

  const openCreate = () => setModalState({ open: true, editData: null });
  const openEdit = (code) => setModalState({ open: true, editData: code });
  const closeModal = () => setModalState({ open: false, editData: null });

  return (
    <div className={styles.container}>
      <PromoStatsBar stats={stats} isLoading={isLoading} />

      {/* Table Header */}
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>
          {t("admin.marketing.promo.all_codes", "All promo codes")}
        </h2>
        <button className={styles.newBtn} onClick={openCreate}>
          <Plus size={15} />
          {t("admin.marketing.promo.new_code", "+ New code")}
        </button>
      </div>

      <PromoTable
        codes={promoCodes}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        onToggleActive={(code) =>
          updateMutation.mutate({ id: code.id, updates: { is_active: !code.is_active } })
        }
        onRenew={(code) => openEdit(code)}
      />

      {modalState.open && (
        <PromoModal
          editData={modalState.editData}
          onClose={closeModal}
          onCreate={createMutation.mutate}
          onUpdate={(id, updates) => updateMutation.mutate({ id, updates })}
          isCreating={createMutation.isPending}
          isUpdating={updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default PromoCodes;
