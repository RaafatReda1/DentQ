import React from 'react'
import { supabase } from '../../../utils/SupabaseClient';

const SignOutBtn = () => {
    const signOut = async() => {
        const {data, error} = await supabase.auth.signOut();
        if (error){
            console.log(error)
        }else{
            console.log("Sign out Successfully",data);
            window.location.reload();
        }
    }
  return (
    <button onClick={signOut}>SignOutBtn</button>
  )
}

export default SignOutBtn