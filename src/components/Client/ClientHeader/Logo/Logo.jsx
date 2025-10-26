import React from 'react'
import styles from "./Logo.module.css"
const Logo = () => {
  return (
    <div className={styles.logoParent}>
        <img className={styles.logoImg} src='/logo.png'></img>
    </div>
  )
}

export default Logo