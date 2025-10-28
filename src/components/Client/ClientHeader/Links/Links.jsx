import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import Tooltip from "@mui/material/Tooltip";
import styles from "./Links.module.css";
import menuStyles from "../MobileMenu/MobileMenu.module.css";

import { Bell, Boxes, BriefcaseMedical, ShoppingCart } from "lucide-react";
const Links = ({menuIsOpened}) => {
  return (
    <div className={menuIsOpened ? menuStyles.linksWraper : styles.linksWraper}>
      <Link to="/cart" className={styles.link}>
        <Badge
          badgeContent={3}
          // this is the bg color of the badge
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#00b7a8",
              color: "white",
            },
          }}
        >
          <ShoppingCart />
          <span className= {styles.linkTxt}>Cart</span>
        </Badge>
      </Link>

      <Link to="/notifications" className={styles.link}>
        <Badge badgeContent={5} color="error">
          <NotificationsIcon />
          <span className= {styles.linkTxt}>Notifications</span>
        </Badge>
      </Link>

      <Link to="/myorders" className={styles.link}>
        <Badge badgeContent={2} color="primary">
          <Boxes />
          <span className= {styles.linkTxt}>MyOrders</span>
        </Badge>
      </Link>

      <Link to="/ourproducts" className={styles.link}>
        <BriefcaseMedical />
        <span className= {styles.linkTxt}>OurProducts</span>
      </Link>
    </div>
  );
};

export default Links;
