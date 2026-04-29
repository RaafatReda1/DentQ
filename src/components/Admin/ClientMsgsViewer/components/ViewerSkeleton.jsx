import React from "react";
import { Skeleton } from "@mui/material";
import styles from "./ViewerSkeleton.module.css";

const ViewerSkeleton = () => (
  <div className={styles.pageWrapper}>
    <div className={styles.pageHeader}>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="text" width={300} height={20} />
    </div>
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div style={{ padding: "16px" }}><Skeleton variant="rectangular" height={36} /></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="90%" height={16} />
          </div>
        ))}
      </div>
      <div className={styles.detailView}>
        <div style={{ padding: "40px" }}>
          <Skeleton variant="rectangular" width="100%" height={200} style={{ borderRadius: 12 }} />
        </div>
      </div>
    </div>
  </div>
);

export default ViewerSkeleton;
