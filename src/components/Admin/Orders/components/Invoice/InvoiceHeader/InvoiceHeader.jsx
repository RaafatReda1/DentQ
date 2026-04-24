import React from "react";
import styles from "./InvoiceHeader.module.css";
const InvoiceHeader = () => {
  const mySvgTriangle = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="256"
      height="256"
      viewBox="0 0 256 256"
      style={{ width: "50px", height: "15px" }}
      fill="none"
      className= {styles.svg}
    >
      <path
        d="M 20 10 L 20 90 L 80 50 Z"
        fill="none"
        stroke="rgb(84, 84, 84)"
        strokeWidth="3"
      />
    </svg>
  );
  return (
    <>
      <header className={styles.invoiceHeader}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="logo" className={styles.logo} />
        </div>
        <span className={styles.outerBorder}></span>
        <h1 className={styles.invoiceTitle}>Invoice</h1>
      </header>

      <section className={styles.invoiceInfo}>

        <div className={styles.svgContainer}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i}>{mySvgTriangle}</span>
          ))}
        </div>

        <div className={styles.invoiceInfoContainer}>
          <span className={styles.orderId}>Id: #d076ec93</span>
          <span className={styles.invoiceDate}>Date: 2023-09-01</span>
        </div>
      </section>
    </>
  );
};

export default InvoiceHeader;
