import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import Tooltip from "@mui/material/Tooltip";
import styles from "./Links.module.css";
import { Bell, Boxes, BriefcaseMedical, ShoppingCart } from "lucide-react";
const Links = () => {
  return (
    <div className={styles.linksWraper}>
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
          <span>Cart</span>
        </Badge>
      </Link>

      <Link to="/notifications" className={styles.link}>
        <Badge badgeContent={5} color="error">
          <NotificationsIcon />
          <span>Notifications</span>
        </Badge>
      </Link>

      <Link to="/myorders" className={styles.link}>
        <Badge badgeContent={2} color="primary">
          <Boxes />
          <span>MyOrders</span>
        </Badge>
      </Link>

      <Link to="/ourproducts" className={styles.link}>
        <BriefcaseMedical />
        <span>OurProducts</span>
      </Link>
    </div>
  );
};

export default Links;
