import React, { useEffect, useRef, useState } from "react";
import styles from "./DefaultHeroSection.module.css";
import { useTranslation } from "react-i18next";
import HeroContent from "./DefaultHeroComponents/HeroContent";
import HeroStats from "./DefaultHeroComponents/HeroStats";
import HeroImage from "./DefaultHeroComponents/HeroImage";

const DefaultHeroSection = ({ banner }) => {
  const { i18n } = useTranslation();
  const isLTR = i18n.language.startsWith("en");

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations when the hero section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.heroOuter} dir={isLTR ? "ltr" : "rtl"} ref={sectionRef}>
      {/* Background Decorative Shapes */}
      <div className={styles.bgShape1}></div>
      <div className={styles.bgShape2}></div>

      <div className={`${styles.container} ${isVisible ? styles.animateIn : ""}`}>

        {/* Left Content Column */}
        <div className={styles.contentCol}>
          <HeroContent banner={banner} />
          <HeroStats />
        </div>

        {/* Right Image Column */}
        <HeroImage banner={banner} />

      </div>
    </div>
  );
};

export default DefaultHeroSection;
