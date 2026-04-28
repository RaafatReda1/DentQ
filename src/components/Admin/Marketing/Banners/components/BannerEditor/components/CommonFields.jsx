import React from "react";
import styles from "../BannerEditor.module.css";

export const Field = ({ label, value, onChange, placeholder, dir }) => (
  <div className={styles.field}>
    <label>{label}</label>
    <input 
      className={styles.input} 
      value={value || ""} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      dir={dir} 
    />
  </div>
);

export const ColorField = ({ label, value, onChange }) => (
  <div className={styles.field}>
    <label>{label}</label>
    <div className={styles.colorRow}>
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className={styles.colorPicker} 
      />
      <input 
        className={styles.input} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="#000000" 
      />
    </div>
  </div>
);
