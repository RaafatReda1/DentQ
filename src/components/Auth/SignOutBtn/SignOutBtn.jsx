import React from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../utils/SupabaseClient';

const SignOutBtn = () => {
    const { t } = useTranslation();

    const signOut = async () => {
        const { data, error } = await supabase.auth.signOut();
        if (error) {
            console.log(error);
        } else {
            console.log("Sign out Successfully", data);
            window.location.reload();
        }
    };

    return (
        <button onClick={signOut}>{t('auth.sign_out', 'Sign Out')}</button>
    );
};

export default SignOutBtn;