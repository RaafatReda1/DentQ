import React from "react";
import { Skeleton } from "@mui/material";

const FooterSkeleton = ({ styles }) => (
  <div className={styles.skeletonWrap} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
    <Skeleton variant="rectangular" width="100%" height={250} style={{ borderRadius: 12 }} />
    <Skeleton variant="text" width="60%" height={30} />
    <Skeleton variant="rectangular" width="100%" height={60} style={{ borderRadius: 8 }} />
    <Skeleton variant="rectangular" width="100%" height={60} style={{ borderRadius: 8 }} />
  </div>
);

export default FooterSkeleton;
