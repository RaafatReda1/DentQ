import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import styles from "./Links.module.css";
import menuStyles from "../MobileMenu/MobileMenu.module.css";
import { useTranslation } from "react-i18next";
import { Boxes, BriefcaseMedical, ShoppingCart, Bell } from "lucide-react";

const Links = ({ menuIsOpened }) => {
  const { t } = useTranslation();

  return (
    <div className={menuIsOpened ? menuStyles.linksWraper : styles.linksWraper}>
      <Link to="/cart" className={styles.link}>
        <Badge
          badgeContent={3}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#00b7a8",
              color: "white",
            },
          }}
        >
          <ShoppingCart />
          <span className={styles.linkTxt}>{t('navbar.cart')}</span>
        </Badge>
      </Link>

      <Link to="/notifications" className={styles.link}>
        <Badge badgeContent={5} color="error">
          <Bell />
          <span className={styles.linkTxt}>{t('navbar.notifications')}</span>
        </Badge>
      </Link>

      <Link to="/myorders" className={styles.link}>
        <Badge badgeContent={2} color="primary">
          <Boxes />
          <span className={styles.linkTxt}>{t('navbar.my_orders')}</span>
        </Badge>
      </Link>

      <Link to="/ourproducts" className={styles.link}>
        <BriefcaseMedical />
        <span className={styles.linkTxt}>{t('navbar.our_products')}</span>
      </Link>
    </div>
  );
};

export default Links;
