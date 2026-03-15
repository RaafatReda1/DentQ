import React, { useEffect, useRef, useState } from "react";
import styles from "./DefaultHeroSection.module.css";
import { useTranslation } from "react-i18next";
import { Phone, Building2, Stethoscope, Users } from "lucide-react";

/**
 * AnimatedCounter: A simple hook-based component to animate numbers counting up
 * with ease-out effect using Intersection Observer.
 */
const AnimatedCounter = ({ end, duration = 2000, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

    if (countRef.current) observer.observe(countRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end); // ensure exact end text
      }
    };

    if (isVisible) {
      animationFrameId = window.requestAnimationFrame(step);
    }

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, isVisible]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

/**
 * Modern Responsive Hero Section with Teal/White Healthcare SaaS Aesthetics
 */
const DefaultHeroSection = () => {
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

  const content = {
    headline: isLTR
      ? "Putting your health first with empathy and skill"
      : "نضع صحتك أولاً بالتعاطف والمهارة",
    subText: isLTR
      ? "We are leading healthcare facility across the States dedicated to providing exceptional service for all patients"
      : "نحن منشأة رعاية صحية رائدة في جميع أنحاء البلاد، مكرسون لتقديم خدمات استثنائية لجميع المرضى",
    getStarted: isLTR ? "Get Started" : "ابدأ الآن",
    callUs: isLTR ? "Call us now!" : "اتصل بنا الآن!",
    clinics: isLTR ? "Clinics" : "عيادات",
    doctors: isLTR ? "Doctors" : "أطباء",
    patients: isLTR ? "Patients" : "مرضى",
  };

  return (
    <div className={styles.heroOuter} dir={isLTR ? "ltr" : "rtl"} ref={sectionRef}>
      {/* Background Decorative Shapes */}
      <div className={styles.bgShape1}></div>
      <div className={styles.bgShape2}></div>

      <div className={`${styles.container} ${isVisible ? styles.animateIn : ""}`}>

        {/* Left Content Column */}
        <div className={styles.contentCol}>
          <div className={styles.textContent}>
            <h1 className={styles.headline}>
              {content.headline}
            </h1>
            <p className={styles.subText}>
              {content.subText}
            </p>
          </div>

          <div className={styles.buttonsGroup}>
            <button className={styles.primaryBtn}>
              {content.getStarted}
            </button>
            <button className={styles.secondaryBtn}>
              <div className={styles.iconCircle}>
                <Phone size={18} />
              </div>
              {content.callUs}
            </button>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statIconWrapper}>
                <Building2 size={24} />
              </div>
              <div className={styles.statText}>
                <h3 className={styles.statNumber}>
                  <AnimatedCounter end={50} suffix="+" />
                </h3>
                <p className={styles.statLabel}>{content.clinics}</p>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIconWrapper}>
                <Stethoscope size={24} />
              </div>
              <div className={styles.statText}>
                <h3 className={styles.statNumber}>
                  <AnimatedCounter end={2} suffix="K+" />
                </h3>
                <p className={styles.statLabel}>{content.doctors}</p>
              </div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statIconWrapper}>
                <Users size={24} />
              </div>
              <div className={styles.statText}>
                <h3 className={styles.statNumber}>
                  <AnimatedCounter end={50} suffix="K+" />
                </h3>
                <p className={styles.statLabel}>{content.patients}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image Column */}
        <div className={styles.imageCol}>
          <div className={styles.imageContainer}>
            {/* The teal background shape for the image */}
            <div className={styles.imageBgShape}></div>
            {/* The group of doctors image */}
            <img
              src="/DefaultHeroSectionImg.png"
              alt="Group of Doctors"
              className={styles.doctorsImage}
            />

            {/* Floating decoration circles */}
            <div className={`${styles.floatingCircle} ${styles.circle1}`}></div>
            <div className={`${styles.floatingCircle} ${styles.circle2}`}></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DefaultHeroSection;
