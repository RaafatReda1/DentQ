import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Products from "./Products_&_Catalogs/Products/Products";
import Catalogs from "./Products_&_Catalogs/Catalogs/Catalogs";
// Note: Future components (Overview, ProductList, etc.) will be imported here in later phases.

const Admin = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />}>
        {/* Default route inside /admin */}
        <Route
          index
          element={
            <div
              style={{
                padding: "20px",
                fontSize: "1.2rem",
                color: "#555",
                fontFamily: "var(--font-main)",
              }}
            >
              Dashboard Overview Component loads here...
            </div>
          }
        />

        {/* Fallbacks for now */}
        <Route path="products" element={<Products />} />
        <Route path="catalogs" element={<Catalogs />} />

        <Route path="orders" element={<div>Orders Module loads here...</div>} />
        <Route
          path="marketing"
          element={<div>Marketing Module loads here...</div>}
        />
        <Route
          path="cms"
          element={<div>CMS Settings Module loads here...</div>}
        />
      </Route>
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/admin" />} replace/>
    </Routes>
  );
};

export default Admin;
