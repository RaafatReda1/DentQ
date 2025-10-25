import React, { useContext } from 'react'
import { userContext } from '../../utils/AppContexts';

const Admin = () => {
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useContext(userContext);
  
  return (
    <h1>Admin</h1>
  )
}

export default Admin