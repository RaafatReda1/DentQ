import React, { useEffect, useState } from 'react'
import UserTypeRouter from '../../utils/UserTypeRouter';
import { supabase } from '../../utils/SupabaseClient';

function useUserData() {
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
    // 1. Initial mounting call (triggers global loading state)
    UserTypeRouter(setUser, true);
    
    // 2. Background auth listener (silent, no loading flash)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event triggered:", event);
      if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', 'PASSWORD_RECOVERY'].includes(event)) {
        UserTypeRouter(setUser, false); // false = silent refresh
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return { user, setUser }
}

export default useUserData