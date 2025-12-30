import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Badge from "@mui/material/Badge";
import styles from "./Links.module.css";
import { useTranslation } from "react-i18next";
import { Boxes, BriefcaseMedical, ShoppingCart, Bell } from "lucide-react";
import { useBadgeNumberCounter } from "../../../../utils/Hooks/useBadgeNumberCounter";

/**
 * Links Component
 * Renders navigation links with dynamic badges for both mobile and desktop.
 */
const Links = ({ menuIsOpened }) => {
  const { t } = useTranslation();
  const { cartCount } = useBadgeNumberCounter();
  const location = useLocation();

  const navLinks = [
    {
      to: "/cart",
      icon: ShoppingCart,
      label: t('navbar.cart'),
      badge: cartCount,
      badgeColor: "#00b7a8"
    },
    {
      to: "/notifications",
      icon: Bell,
      label: t('navbar.notifications'),
      badge: 5,
      badgeColor: "error"
    },
    {
      to: "/myorders",
      icon: Boxes,
      label: t('navbar.my_orders'),
      badge: 2,
      badgeColor: "primary"
    },
    {
      to: "/",
      icon: BriefcaseMedical,
      label: t('navbar.our_products'),
      badge: 0
    },
  ];

  const containerClasses = `${styles.linksWraper} ${menuIsOpened ? styles.isMobile : ""}`;
  useEffect(() => {
    
  },[cartCount])
  return (
    <nav className={containerClasses}>
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.to;

        return (
          <Link
            key={link.to}
            to={link.to}
            className={`${styles.link} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <Badge
              badgeContent={link.badge || 0}
              color={link.badgeColor === "error" || link.badgeColor === "primary" ? link.badgeColor : undefined}
              sx={link.badgeColor && link.badgeColor !== "error" && link.badgeColor !== "primary" ? {
                "& .MuiBadge-badge": {
                  backgroundColor: link.badgeColor,
                  color: "white",
                },
              } : {}}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </Badge>
            <span className={styles.linkTxt}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Links;
