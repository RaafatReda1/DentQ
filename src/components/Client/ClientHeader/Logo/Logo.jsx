import React from 'react'
import styles from "./Logo.module.css"
import { useLogo } from '../../../../utils/LogoContext'
const Logo = () => {
  const { logoUrl } = useLogo();
  return (
    <div className={styles.logoParent}>
        <img className={styles.logoImg} src={logoUrl || '/logo.png'} alt="DentQ" />
    </div>
  )
}

export default Logo