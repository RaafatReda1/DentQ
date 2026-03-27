import { supabase } from "../../../utils/SupabaseClient";
export const signUpAction = async (email, password, fullName) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, user: data.user, session: data.session };
    } catch {
        return { success: false, error: "An unexpected error occurred." };
    }
};
