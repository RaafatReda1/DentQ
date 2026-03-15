import React, { useEffect, useState } from 'react';
import styles from './AboutUs.module.css';
import { useTranslation } from 'react-i18next';
import { fetchAboutUsData } from './Actions';
import AboutHeader from './Subcomponents/AboutHeader/AboutHeader';
import AboutFeatureRow from './Subcomponents/AboutFeatureRow/AboutFeatureRow';
import AboutStats from './Subcomponents/AboutStats/AboutStats';

const AboutUs = () => {
  const { t, i18n } = useTranslation();
  const isLTR = i18n.language.startsWith('en');
  const [dbData, setDbData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAboutUsData();
      if (data) setDbData(data);
    };
    getData();
  }, []);

  const getLocalized = (fieldBase, nsKey) => {
    const fieldName = isLTR ? `${fieldBase}_en` : `${fieldBase}_ar`;
    return (dbData && dbData[fieldName]) ? dbData[fieldName] : t(nsKey);
  };

  const getNumber = (fieldBase, fallbackNum) => {
    return (dbData && dbData[fieldBase]) ? dbData[fieldBase] : fallbackNum;
  };

  const getImage = (fieldBase, fallbackUrl) => {
    return (dbData && dbData[fieldBase]) ? dbData[fieldBase] : fallbackUrl;
  };

  return (
    <div className={styles.aboutContainer} dir={isLTR ? "ltr" : "rtl"}>
      <AboutHeader
        title={getLocalized("title", "about_us.title")}
        subtitle={getLocalized("subtitle", "about_us.subtitle")}
      />

      <div className={styles.contentGrid}>
        <AboutFeatureRow
          title={getLocalized("mission_title", "about_us.mission_title")}
          text={getLocalized("mission_text", "about_us.mission_text")}
          imageSrc={getImage("mission_image_url", "/about_hero.png")}
          imageAlt="DentQ Warehouse Operations"
          isReversed={false}
        />

        <AboutFeatureRow
          title={getLocalized("how_it_works_title", "about_us.how_it_works_title")}
          text={getLocalized("how_it_works_text", "about_us.how_it_works_text")}
          imageSrc={getImage("how_it_works_image_url", "/about_delivery.png")}
          imageAlt="DentQ Delivery Logistics"
          isReversed={true}
          delay="0.2s"
        />

        <AboutFeatureRow
          title={getLocalized("commitment_title", "about_us.commitment_title")}
          text={getLocalized("commitment_text", "about_us.commitment_text")}
          imageSrc={getImage("commitment_image_url", "/DefaultHeroSectionImg.png")}
          imageAlt="DentQ Professional Care"
          imageObjectPosition="top"
          isReversed={false}
        />
      </div>

      <AboutStats
        clinicsNum={getNumber("clinics_number", "50+")}
        clinicsLabel={getLocalized("stats_clinics", "about_us.stats.clinics")}
        distributorsNum={getNumber("distributors_number", "45+")}
        distributorsLabel={getLocalized("stats_distributors", "about_us.stats.distributors")}
        deliveriesNum={getNumber("deliveries_number", "6K+")}
        deliveriesLabel={getLocalized("stats_deliveries", "about_us.stats.deliveries")}
      />
    </div>
  );
};

export default AboutUs;