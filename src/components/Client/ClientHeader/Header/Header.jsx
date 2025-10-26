import React from 'react'
import styles from "./Header.module.css"
import Logo from '../Logo/Logo'
const Header = () => {
  return (
    <div className= {styles.Header}>
      <Logo/>
    </div>
  )
}

export default Header