import React, { useEffect, useState } from 'react'
import UserTypeRouter from '../../utils/UserTypeRouter';

function UserDataStorage() {
      const [user, setUser] = useState({
        type: "",
        fullName: "",
        nickName: "",
        session: false,
        email: "",
        avatarUrl: "",
        phone: "",
        address: "",
        loadingState: true,
      });
        useEffect(() => {
          UserTypeRouter(user, setUser);
          console.log("userData is:", user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []); //this function cheks auth state changes
  return {user, setUser}
}

export default UserDataStorage