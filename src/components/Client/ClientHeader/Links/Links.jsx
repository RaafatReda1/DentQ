import React from "react";
import styles from "./Links.module.css";
import { Link } from "react-router-dom";
import { Bell, Boxes, BriefcaseMedical, ShoppingCart } from "lucide-react";
const Links = () => {
  return (
    <div className={styles.linksWraper}>
      <Link to="/cart" className= {styles.link}>
        <ShoppingCart />
        <span>Cart</span>
      </Link>
      <Link to="/notifications" className= {styles.link}>
        <Bell />
        <span>Notifications</span>
      </Link>


      <Link to="/myorders" className= {styles.link}>
        <Boxes />
        <span>MyOrders</span>
      </Link>
      <Link to="/ourproducts" className= {styles.link}>
        <BriefcaseMedical/>
        <span>OurProducts</span>
      </Link>
    </div>
  );
};

export default Links;