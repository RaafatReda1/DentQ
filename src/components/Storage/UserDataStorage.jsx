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
    // Initial fetch
    UserTypeRouter(user, setUser);
    
    // Listen for authentication state changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event triggered:", event);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        UserTypeRouter(user, setUser);
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