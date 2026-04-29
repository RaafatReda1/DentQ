import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from '../Dashboard.module.css';

const InfoTooltip = ({ translationKey, values = {} }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.infoTooltipWrapper}>
      <HelpCircle size={14} className={styles.infoIcon} />
      <div className={styles.infoPopup}>
        <div className={styles.infoDesc}>
          {t(`admin.dashboard.charts.${translationKey}_desc`, t(`admin.dashboard.metrics.${translationKey}_desc`))}
        </div>
        <div className={styles.infoEx}>
          {t(`admin.dashboard.charts.${translationKey}_ex`, { ...values, defaultValue: t(`admin.dashboard.metrics.${translationKey}_ex`, values) })}
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;
