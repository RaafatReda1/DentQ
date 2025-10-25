import React from 'react'
import { supabase } from '../../../utils/SupabaseClient';

const GoogleBtn = () => {
    const signInWithGoogle = async() => {
        const {data, error} = await supabase.auth.signInWithOAuth({provider: 'google'});
        if (error){
            console.log(error)
        }else if(data){
            console.log("Sign in Successfully",data)
        }
    }
  return (
    <button onClick={signInWithGoogle}>GoogleBtn</button>
)
}

export default GoogleBtn